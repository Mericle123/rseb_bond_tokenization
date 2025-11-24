import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/sui/utils';
import { restoreKeypairFromEncryptedMnemonic } from './suiclient';

// -----------------------------
// Env
// -----------------------------
const PORT = process.env.PORT || 3001;
const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl('testnet');

// Phase 2 (KYC)
const NDI_PACKAGE_ID = process.env.NEXT_PUBLIC_NDI_PACKAGE_ID;
const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID;
const KYC_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_ADMIN_CAP_ID;

// Signing keys (shared/default)
const ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_ADMIN_KEY_B64 || '').trim();
const ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_ADMIN_KEY_HEX || '').trim();

// Phase 3 (BTNC mint for fiat conversion)
const BTNC_PACKAGE_ID = process.env.NEXT_PUBLIC_BTNC_PACKAGE_ID;
const BTNC_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_BTNC_ADMIN_CAP_ID;
const BTNC_TREASURY_CAP_ID = process.env.NEXT_PUBLIC_BTNC_TREASURY_CAP_ID;
// Optional different admin for BTNC:
const BTNC_ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_B64 || '').trim();
const BTNC_ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_HEX || '').trim();

// -----------------------------
// Sui client
// -----------------------------
const client = new SuiClient({ url: SUI_RPC });

// export async function buyBtn(recipient, amountBTN){
//   try {
//     // Mint BTNC base units equal to tenths
//     const digest = await mintBtncTo({ recipient, tenths: amountBTN });
//     if(!digest){
//         return Error("Transaction error")
//     }

//   } catch (e) {
//     console.error('/fiat/convert-to-btnc error:', e);
//     return Error('convert_failed')
//   }
// }

export async function buyBtn(recipient: string, amountBTN: string | number) {
  try {
    // Convert human BTN (e.g. "100" or 100.0) -> tenths
    const tenths = toTenths(amountBTN);

    const digest = await mintBtncTo({ recipient, tenths });
    if (!digest) {
      throw new Error("Transaction error");
    }

    return {
      ok: true,
      recipient,
      // numeric (tenths)
      amountBaseUnits: tenths,
      // human-friendly
      amountBTNC: formatBtnFromTenths(tenths),
      txDigest: digest,
    };
  } catch (e) {
    console.error("/fiat/convert-to-btnc error:", e);
    return {
      ok: false,
      error: "convert_failed",
    };
  }
}


async function mintBtncTo({ recipient, tenths }) {

  if (!BTNC_PACKAGE_ID || !BTNC_ADMIN_CAP_ID || !BTNC_TREASURY_CAP_ID) {
    throw new Error('BTNC_* env missing (package/admin/treasury)');
  }
  if (!Number.isInteger(tenths) || tenths <= 0) throw new Error('tenths must be positive integer');
  const signer = getBtncAdmin();

  async function tryOrder(order) {
    const tx = new Transaction();
    if (order === 'addr-first') {
      tx.moveCall({
        target: `${BTNC_PACKAGE_ID}::btnc::mint`,
        arguments: [
          tx.object(BTNC_ADMIN_CAP_ID),
          tx.object(BTNC_TREASURY_CAP_ID),
          tx.pure.address(recipient),
          tx.pure.u64(tenths),
        ],
      });
    } else {
      tx.moveCall({
        target: `${BTNC_PACKAGE_ID}::btnc::mint`,
        arguments: [
          tx.object(BTNC_ADMIN_CAP_ID),
          tx.object(BTNC_TREASURY_CAP_ID),
          tx.pure.u64(tenths),
          tx.pure.address(recipient),
        ],
      });
    }
    return await client.signAndExecuteTransaction({
      transaction: tx,
      signer,
      options: { showEffects: true },
    });
  }

  try {
    const res = await tryOrder('addr-first');
    return res.digest;
  } catch (e) {
    const msg = `${e?.message || ''} ${e?.cause?.executionErrorSource || ''}`;
    const likelyTypeMismatch =
      msg.includes('expects u64') ||
      msg.includes('InvalidBCSBytes') ||
      msg.includes('CommandArgumentError') ||
      msg.includes('BCS');
    if (!likelyTypeMismatch) throw e;
    const res2 = await tryOrder('amount-first');
    return res2.digest;
  }
}

export async function getBtncBalance({ address }) {
  try {
    let owner = address;

    // If no address, try to resolve from requestId session
    // if (!owner && requestId) {
    //   if (!s || s.state !== 'VERIFIED' || !s.custodialAddress) {
    //     throw new Error('session_invalid');
    //   }
    //   owner = s.custodialAddress;
    // }

    if (!owner) throw new Error('missing_address');

    const coinType = BTNCCoinType();
    const r = await client.getBalance({ owner, coinType });
    const baseStr = r?.totalBalance ?? "0";
    const balanceTenths = BigInt(baseStr);

    return {
      address: owner,
      coinType,
      balanceBaseUnits: baseStr,
      balanceTenths,                          // raw tenths (as bigint)
      balanceHuman: formatBtnFromTenths(balanceTenths), // "1,234.5"
    };

  } catch (e) {
    console.error('getBtncBalance error:', e);
    throw e; // rethrow to handle upstream
  }
}


export async function transBtn({ mnemonics, sender, toAddress, amountBTNC }: {
  mnemonics: string,
  sender: string;
  toAddress: string;
  amountBTNC: string | number;

}) {
  try {
    if (!toAddress) throw new Error("missing_toAddress");
    // if (!fromRequestId) throw new Error("missing_fromRequestId");

    // Validate sender session
    // const s = sessions.get(fromRequestId);
    // if (!s || s.state !== "VERIFIED" || !s.custodialAddress) {
    //   throw new Error("session_invalid");
    // }

    // Retrieve sender’s custodial keypair
    // const kp = custodialsByAddress.get(sender);
    // if (!kp) throw new Error("custodial_key_missing (re-verify to regenerate key)");

    const tenths = toTenths(amountBTNC);
    const coinType = BTNCCoinType();

    const signer = await restoreKeypairFromEncryptedMnemonic(mnemonics)
    // Ensure sender has SUI for gas
    await fundSuiIfNeeded(sender);

    // Load all BTNC coins owned by sender
    const coins = await getAllCoins(sender, coinType);
    if (coins.length === 0) throw new Error("no_btnc");

    const total = coins.reduce((acc, c) => acc + BigInt(c.balance || "0"), 0n);
    if (total < BigInt(tenths)) throw new Error("insufficient_btnc");

    // Build transaction
    const primaryId = coins[0].coinObjectId;
    const otherIds = coins.slice(1).map((c) => c.coinObjectId);

    const tx = new Transaction();
    const primary = tx.object(primaryId);

    if (otherIds.length > 0) {
      tx.mergeCoins(primary, otherIds.map((id) => tx.object(id)));
    }

    const split = tx.splitCoins(primary, [tx.pure.u64(tenths)]);
    tx.transferObjects([split], tx.pure.address(toAddress));

    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer,
      options: { showEffects: true },
    });

    return {
      ok: true,
      from: sender,
      to: toAddress,
      amountBTNC: formatBtnFromTenths(tenths), // "1,234.5"
      amountBaseUnits: tenths,                 // 12345 (tenths)
      txDigest: result.digest,
    };

  } catch (e: any) {
    console.error("transBtn error:", e);
    return {
      ok: false,
      error: "transfer_failed",
      detail: e.message,
    };
  }
}

function hexToBytes(hex) {
  const clean = hex.replace(/^0x/i, '').trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error('hex key has odd length');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(b)) throw new Error('hex key contains non-hex chars');
    out[i] = b;
  }
  return out;
}
function parseSecret({ b64, hex }) {
  if (b64) {
    let raw;
    try {
      raw = fromBase64(b64.replace(/^"+|"+$/g, '').trim());
    } catch {
      throw new Error('base64 secret invalid');
    }
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`base64 decoded unexpected length: ${raw.length}`);
  }
  if (hex) {
    const raw = hexToBytes(hex.replace(/^"+|"+$/g, '').trim());
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`hex decoded unexpected length: ${raw.length}`);
  }
  throw new Error('missing admin secret');
}

// Default admin (KYC + BTNC if no BTNC-specific key is set)
let _DEFAULT_ADMIN;
function getDefaultAdmin() {
  if (_DEFAULT_ADMIN) return _DEFAULT_ADMIN;
  const secret = parseSecret({ b64: ADMIN_KEY_B64, hex: ADMIN_KEY_HEX });
  _DEFAULT_ADMIN = Ed25519Keypair.fromSecretKey(secret);
  console.log('[admin] default signer:', _DEFAULT_ADMIN.getPublicKey().toSuiAddress());
  return _DEFAULT_ADMIN;
}

// Optional separate admin for BTNC
let _BTNC_ADMIN;
function getBtncAdmin() {
  if (_BTNC_ADMIN) return _BTNC_ADMIN;
  if (BTNC_ADMIN_KEY_B64 || BTNC_ADMIN_KEY_HEX) {
    const secret = parseSecret({ b64: BTNC_ADMIN_KEY_B64, hex: BTNC_ADMIN_KEY_HEX });
    _BTNC_ADMIN = Ed25519Keypair.fromSecretKey(secret);
    console.log('[admin] BTNC signer:', _BTNC_ADMIN.getPublicKey().toSuiAddress());
    return _BTNC_ADMIN;
  }
  _BTNC_ADMIN = getDefaultAdmin();
  return _BTNC_ADMIN;
}

// -----------------------------
// Units: tenths (decimals = 1)
// -----------------------------
/**
 * Parse human BTN/BTNC -> integer tenths.
 * Accepts integers or one decimal (e.g., "29.9").
 */
function toTenths(human) {
  if (typeof human === 'number') {
    if (!Number.isFinite(human)) throw new Error('Invalid amount');
    const scaled = Math.round(human * 10);
    if (Math.abs(scaled - human * 10) > 1e-9) throw new Error('Only 1 decimal allowed');
    if (scaled <= 0) throw new Error('Amount must be > 0');
    return scaled;
  }
  const s = String(human).trim();
  if (!/^\d+(\.\d{1})?$/.test(s)) {
    if (/^\d+$/.test(s)) return parseInt(s, 10) * 10;
    throw new Error('Only integers or 1 decimal place allowed');
  }
  const [i, f = ''] = s.split('.');
  const tenths = parseInt(i, 10) * 10 + (f ? parseInt(f, 10) : 0);
  if (tenths <= 0) throw new Error('Amount must be > 0');
  return tenths;
}
function formatTenths(tenths) {
  const t = Number(tenths);
  if (!Number.isFinite(t)) return '0';
  const intPart = Math.trunc(t / 10);
  const frac = Math.abs(t % 10);
  return frac === 0 ? String(intPart) : `${intPart}.${frac}`;
}
function formatTenthsFromBigInt(baseStr) {
  const bi = BigInt(baseStr || '0');
  const intPart = bi / 10n;
  const frac = bi % 10n;
  return frac === 0n ? intPart.toString() : `${intPart.toString()}.${frac.toString()}`;
}

// -----------------------------
// Helpers: coin type + coin queries
// -----------------------------
function BTNCCoinType() {
  if (!BTNC_PACKAGE_ID) throw new Error('BTNC_PACKAGE_ID missing');
  return `${BTNC_PACKAGE_ID}::btnc::BTNC`;
}
async function getAllCoins(owner, coinType) {
  let cursor = null;
  const out = [];
  while (true) {
    const r = await client.getCoins({ owner, coinType, cursor, limit: 200 });
    out.push(...r.data);
    if (!r.hasNextPage) break;
    cursor = r.nextCursor;
  }
  return out;
}

// -----------------------------
// Gas helpers (SUI top-up)
// -----------------------------
const SUI_COIN_TYPE = '0x2::sui::SUI';
// Defaults (in MIST; 1 SUI = 1_000_000_000 MIST)
const MIN_SUI_MIST = BigInt(process.env.MIN_SUI_MIST ?? 80_000_000);   // 0.08 SUI
const TOPUP_SUI_MIST = BigInt(process.env.TOPUP_SUI_MIST ?? 200_000_000); // 0.20 SUI

async function getSuiBalanceMist(owner) {
  const b = await client.getBalance({ owner, coinType: SUI_COIN_TYPE });
  return BigInt(b?.totalBalance ?? '0');
}

async function fundSuiTo(address, amountMist) {
  const admin = getDefaultAdmin();
  const tx = new Transaction();
  // split a new coin from the admin's gas and send it
  const split = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist.toString())]);
  tx.transferObjects([split], tx.pure.address(address));
  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: admin,
    options: { showEffects: true },
  });
  return res.digest;
}

async function fundSuiIfNeeded(address) {
  const bal = await getSuiBalanceMist(address);
  if (bal >= MIN_SUI_MIST) return null; // already enough for gas
  return await fundSuiTo(address, TOPUP_SUI_MIST);
}


// ---------- Human-friendly BTN formatting ----------

// Convert tenths -> numeric BTN (e.g. 1234 -> 123.4)
function tenthsToNumber(tenths: number | string | bigint): number {
  if (typeof tenths === "bigint") return Number(tenths) / 10;
  return Number(tenths) / 10;
}

// Indian-style number format, 1 decimal place
const nfBTN = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// Format from tenths to something like "1,234.5"
function formatBtnFromTenths(tenths: number | string | bigint): string {
  return nfBTN.format(tenthsToNumber(tenths));
}
