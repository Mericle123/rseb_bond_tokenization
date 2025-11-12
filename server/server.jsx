// backend/src/server.js
// Phase 2 + 3 backend:
//   - QR + NDI bridge + on-chain KYC
//   - Simulated mBoB ledger (BTN) with BTN -> BTNC conversion 1:1 (decimals=1)
//   - BTNC balance endpoint and BTNC transfer (from custodial wallet)
//   - Auto SUI gas top-up for custodial before BTNC transfer

import 'dotenv/config';
import express from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import cors from 'cors';
import { createHash } from 'node:crypto';

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64 } from '@mysten/sui/utils';
import { walletGeneration } from './cryptography/keypair'
// -----------------------------
// Express setup
// -----------------------------
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

// -----------------------------
// Env
// -----------------------------
const PORT = process.env.PORT || 3001;
const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl('testnet');

// Phase 2 (KYC)
const NDI_PACKAGE_ID = process.env.NDI_PACKAGE_ID;
const REGISTRY_ID = process.env.REGISTRY_ID;
const KYC_ADMIN_CAP_ID = process.env.ADMIN_CAP_ID;

// Signing keys (shared/default)
const ADMIN_KEY_B64 = (process.env.ADMIN_KEY_B64 || '').trim();
const ADMIN_KEY_HEX = (process.env.ADMIN_KEY_HEX || '').trim();

// Phase 3 (BTNC mint for fiat conversion)
const BTNC_PACKAGE_ID = process.env.BTNC_PACKAGE_ID;
const BTNC_ADMIN_CAP_ID = process.env.BTNC_ADMIN_CAP_ID;
const BTNC_TREASURY_CAP_ID = process.env.BTNC_TREASURY_CAP_ID;
// Optional different admin for BTNC:
const BTNC_ADMIN_KEY_B64 = (process.env.BTNC_ADMIN_KEY_B64 || '').trim();
const BTNC_ADMIN_KEY_HEX = (process.env.BTNC_ADMIN_KEY_HEX || '').trim();

// -----------------------------
// Sui client
// -----------------------------
const client = new SuiClient({ url: SUI_RPC });

// -----------------------------
// In-memory stores
// -----------------------------
/**
 * QR/KYC Session:
 * requestId -> {
 *   createdAt: number,
 *   state: 'PENDING'|'VERIFIED'|'ERROR',
 *   reason?: string,
 *   age?: number,
 *   txDigest?: string,
 *   custodialAddress?: string,
 *   ndiHashHex?: string
 * }
 */
const sessions = new Map();

/** Custodial key vault (dev-only): address -> Ed25519Keypair */
const custodialsByAddress = new Map();

/** Simulated mBoB ledger */
const bank = { accounts: new Map() }; // id -> { id, ownerRid, bank, name, balanceTenthsBTN }

// -----------------------------
// Helpers: encoding + keys
// -----------------------------
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
      raw = fromB64(b64.replace(/^"+|"+$/g, '').trim());
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

// -----------------------------
// On-chain calls
// -----------------------------
async function writeKycOnChain({ userAddress, age, ndiHashBytes }) {
  if (!NDI_PACKAGE_ID || !REGISTRY_ID || !KYC_ADMIN_CAP_ID) {
    throw new Error('NDI_PACKAGE_ID / REGISTRY_ID / ADMIN_CAP_ID missing');
  }
  const signer = getDefaultAdmin();
  const tx = new Transaction();
  tx.moveCall({
    target: `${NDI_PACKAGE_ID}::ndi_kyc::set_verified`,
    arguments: [
      tx.object(KYC_ADMIN_CAP_ID),
      tx.object(REGISTRY_ID),
      tx.pure.address(userAddress),
      tx.pure.u16(age),
      tx.pure.vector('u8', new Uint8Array(ndiHashBytes)),
      tx.pure.address(userAddress),
      tx.pure.u64(Date.now()),
    ],
  });
  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true, showEvents: true },
  });
  return res.digest;
}

/**
 * Mint BTNC base units (tenths) to recipient.
 * Robust to signature order differences.
 */
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

// -----------------------------
// Custodial generator (dev; we store keypair in memory for transfers)
// -----------------------------
// function createCustodial() {
//   const kp = Ed25519Keypair.generate();
//   const address = kp.getPublicKey().toSuiAddress();
//   custodialsByAddress.set(address, kp);
//   return { keypair: kp, address };
// }

// -----------------------------
// QR session endpoints
// -----------------------------
app.post('/auth/qr/start', async (_req, res) => {
  try {
    const requestId = uuidv4();
    sessions.set(requestId, { createdAt: Date.now(), state: 'PENDING' });
    const deeplink = `bbp://ndi/login?request_id=${requestId}&redirect_uri=${encodeURIComponent(
      process.env.NDI_REDIRECT_URI || `http://localhost:${PORT}/ndi/callback`,
    )}`;
    const qrPng = await QRCode.toDataURL(deeplink);
    res.json({ requestId, deeplink, qrPng });
  } catch (e) {
    console.error('qr/start error:', e);
    res.status(500).json({ error: 'qr_start_failed' });
  }
});

app.get('/auth/status/:id', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'not_found' });
  res.json(s);
});

async function completeVerification({ requestId, nationalId, dateOfBirth, ageOverride }) {
  const session = sessions.get(requestId);
  if (!session) throw new Error('Invalid requestId');

  const computedAge = dayjs().diff(dayjs(dateOfBirth), 'year');
  const age = Number.isFinite(ageOverride) ? ageOverride : computedAge;
  if (age < 18) {
    session.state = 'ERROR';
    session.reason = 'UNDERAGE';
    session.age = age;
    return;
  }

  const ndiHashHex = createHash('sha256').update(nationalId).digest('hex');
  const ndiHashBytes = Buffer.from(ndiHashHex, 'hex');

  const { address: custodialAddress } = await walletGeneration();

  const digest = await writeKycOnChain({ userAddress: custodialAddress, age, ndiHashBytes });

  session.state = 'VERIFIED';
  session.age = age;
  session.txDigest = digest;
  session.custodialAddress = custodialAddress;
  session.ndiHashHex = ndiHashHex;
}

app.get('/ndi/callback', async (req, res) => {
  try {
    const { request_id: requestId, age } = req.query;
    if (!requestId) return res.status(400).send('Missing request_id');

    await completeVerification({
      requestId,
      nationalId: 'DUMMY-NDI-1234567890',
      dateOfBirth: '2000-01-01',
      ageOverride: age ? parseInt(age, 10) : undefined,
    });

    res.redirect(
      `${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}/verified?rid=${requestId}`,
    );
  } catch (e) {
    console.error('/ndi/callback error:', e);
    const rid = req.query?.request_id;
    if (rid && sessions.has(rid)) {
      const s = sessions.get(rid);
      s.state = 'ERROR';
      s.reason = 'CALLBACK_FAILED';
    }
    res.status(500).json({ error: 'callback_failed' });
  }
});

app.get('/dev/simulate-scan', async (req, res) => {
  try {
    const { requestId, age = 22 } = req.query;
    if (!requestId) return res.status(400).json({ error: 'missing_requestId' });

    await completeVerification({
      requestId,
      nationalId: 'DEV-NDI-0000',
      dateOfBirth: '2000-01-01',
      ageOverride: parseInt(age, 10),
    });

    res.json({ ok: true });
  } catch (e) {
    console.error('/dev/simulate-scan error:', e);
    const rid = req.query?.requestId;
    if (rid && sessions.has(rid)) {
      const s = sessions.get(rid);
      s.state = 'ERROR';
      s.reason = 'SIMULATE_FAILED';
    }
    res.status(500).json({ error: 'simulate_failed' });
  }
});

// -----------------------------
// Phase 3: Simulated mBoB ledger (BTN tenths) + BTN -> BTNC
// -----------------------------
app.post('/mbob/accounts', (req, res) => {
  try {
    const { requestId, name } = req.body || {};
    if (!requestId) return res.status(400).json({ error: 'missing_requestId' });
    const s = sessions.get(requestId);
    if (!s || s.state !== 'VERIFIED') {
      return res.status(400).json({ error: 'session_not_verified' });
    }
    const id = uuidv4();
    const acct = {
      id,
      ownerRid: requestId,
      bank: 'BNB_MBOB',
      name: name || 'My mBoB',
      balanceTenthsBTN: 0,
    };
    bank.accounts.set(id, acct);
    res.json({
      ...acct,
      balanceBTN: formatTenths(acct.balanceTenthsBTN),
    });
  } catch (e) {
    console.error('/mbob/accounts error:', e);
    res.status(500).json({ error: 'create_account_failed' });
  }
});

app.get('/mbob/accounts/:id', (req, res) => {
  const acct = bank.accounts.get(req.params.id);
  if (!acct) return res.status(404).json({ error: 'not_found' });
  res.json({ ...acct, balanceBTN: formatTenths(acct.balanceTenthsBTN) });
});

app.get('/mbob/accounts', (req, res) => {
  const { requestId } = req.query;
  const all = Array.from(bank.accounts.values());
  const list = requestId ? all.filter((a) => a.ownerRid === requestId) : all;
  res.json({
    accounts: list.map((a) => ({ ...a, balanceBTN: formatTenths(a.balanceTenthsBTN) })),
  });
});

app.post('/mbob/deposit', (req, res) => {
  try {
    const { accountId, amountBTN } = req.body || {};
    if (!accountId) return res.status(400).json({ error: 'missing_accountId' });
    const acct = bank.accounts.get(accountId);
    if (!acct) return res.status(404).json({ error: 'account_not_found' });

    const tenths = toTenths(amountBTN);
    acct.balanceTenthsBTN += tenths;

    res.json({
      ok: true,
      account: { ...acct, balanceBTN: formatTenths(acct.balanceTenthsBTN) },
      depositedBTN: formatTenths(tenths),
    });
  } catch (e) {
    console.error('/mbob/deposit error:', e);
    res.status(400).json({ error: 'deposit_failed', detail: e.message });
  }
});

app.post('/fiat/convert-to-btnc', async (req, res) => {
  try {
    const { accountId, amountBTN } = req.body || {};
    if (!accountId) return res.status(400).json({ error: 'missing_accountId' });

    const acct = bank.accounts.get(accountId);
    if (!acct) return res.status(404).json({ error: 'account_not_found' });

    const s = sessions.get(acct.ownerRid);
    if (!s || s.state !== 'VERIFIED' || !s.custodialAddress) {
      return res.status(400).json({ error: 'owner_not_verified' });
    }

    const tenths = toTenths(amountBTN); // human -> tenths
    if (acct.balanceTenthsBTN < tenths) {
      return res.status(400).json({ error: 'insufficient_btn_balance' });
    }

    // Debit BTN tenths
    acct.balanceTenthsBTN -= tenths;

    // Mint BTNC base units equal to tenths
    const digest = await mintBtncTo({ recipient: s.custodialAddress, tenths });

    res.json({
      ok: true,
      account: { ...acct, balanceBTN: formatTenths(acct.balanceTenthsBTN) },
      mintedBTNC: formatTenths(tenths),     // human display (e.g., "150", "29.9")
      mintedBaseUnits: tenths,              // raw base units on-chain
      recipient: s.custodialAddress,
      txDigest: digest,
    });
  } catch (e) {
    console.error('/fiat/convert-to-btnc error:', e);
    res.status(500).json({ error: 'convert_failed', detail: e.message });
  }
});

// -----------------------------
// BTNC balance and transfer (+ gas top-up)
// -----------------------------

// Get BTNC balance for an address (or requestId -> custodial address)
app.get('/balance/btnc', async (req, res) => {
  try {
    const { address, requestId } = req.query;
    let owner = address;
    if (!owner && requestId) {
      const s = sessions.get(requestId);
      if (!s || s.state !== 'VERIFIED' || !s.custodialAddress) {
        return res.status(400).json({ error: 'session_invalid' });
      }
      owner = s.custodialAddress;
    }
    if (!owner) return res.status(400).json({ error: 'missing_address' });

    const coinType = BTNCCoinType();
    const r = await client.getBalance({ owner, coinType });
    const baseStr = r?.totalBalance ?? '0';

    res.json({
      address: owner,
      coinType,
      balanceBaseUnits: baseStr,
      balanceHuman: formatTenthsFromBigInt(baseStr), // decimals=1
    });
  } catch (e) {
    console.error('/balance/btnc error:', e);
    res.status(500).json({ error: 'balance_failed' });
  }
});

// Transfer BTNC from custodial wallet (identified by requestId) to another address
app.post('/btnc/transfer', async (req, res) => {
  try {
    const { fromRequestId, toAddress, amountBTNC } = req.body || {};
    if (!fromRequestId) return res.status(400).json({ error: 'missing_fromRequestId' });
    if (!toAddress) return res.status(400).json({ error: 'missing_toAddress' });

    const s = sessions.get(fromRequestId);
    if (!s || s.state !== 'VERIFIED' || !s.custodialAddress) {
      return res.status(400).json({ error: 'session_invalid' });
    }
    const sender = s.custodialAddress;
    const kp = custodialsByAddress.get(sender);
    if (!kp) {
      // Likely backend restarted; in dev, ask user to re-verify to regenerate custodial key
      return res.status(400).json({ error: 'custodial_key_missing' });
    }

    const tenths = toTenths(amountBTNC);
    const coinType = BTNCCoinType();

    // Ensure the custodial sender has SUI for gas
    await fundSuiIfNeeded(sender);

    // Load all BTNC coins and ensure enough balance
    const coins = await getAllCoins(sender, coinType);
    if (coins.length === 0) return res.status(400).json({ error: 'no_btnc' });

    const total = coins.reduce((acc, c) => acc + BigInt(c.balance || '0'), 0n);
    if (total < BigInt(tenths)) {
      return res.status(400).json({ error: 'insufficient_btnc' });
    }

    // Build transfer:
    //  - merge all BTNC coins into the first
    //  - split 'tenths' out of the primary
    //  - transfer the split to recipient
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
      signer: kp,
      options: { showEffects: true },
    });

    res.json({
      ok: true,
      from: sender,
      to: toAddress,
      amountBTNC: formatTenths(tenths),
      amountBaseUnits: tenths,
      txDigest: result.digest,
    });
  } catch (e) {
    console.error('/btnc/transfer error:', e);
    res.status(500).json({ error: 'transfer_failed', detail: e.message });
  }
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log('[admin] initialising admin(s) ...');
  try {
    getDefaultAdmin();
  } catch (e) {
    console.warn('[admin] default key warning:', e.message);
  }
  try {
    getBtncAdmin();
  } catch (e) {
    console.warn('[admin] BTNC key warning:', e.message);
  }
  console.log(`NDI backend + mBoB bridge listening on :${PORT}`);
});
