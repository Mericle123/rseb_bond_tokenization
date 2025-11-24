/* sui/bondClient.ts
   Client helpers for bond_tokenization::bond_single Move module.

   IMPORTANT: This file must only run on the server (it uses private keys).
*/
"use server"


import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import { restoreKeypairFromEncryptedMnemonic } from "./suiclient";
import { BondType, Status, Market, Type as EventType } from "@prisma/client";
import { db } from "@/server/db";

type Status = "up" | "down" | "flat";

const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl("testnet");

// Bond package / module envs
const BOND_PACKAGE_ID = process.env.NEXT_PUBLIC_BOND_PACKAGE_ID; // e.g. "0xabc..." (should NOT be NEXT_PUBLIC for caps/keys)
const BOND_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_BOND_ADMIN_CAP_ID;
const BOND_SINGLE_MODULE = `${BOND_PACKAGE_ID}::bond_single`;
const BOND_ISSUER_ADDRESS = process.env.NEXT_PUBLIC_BOND_ISSUER_ADDRESS;

// KYC registry (ndi_kyc)
const NDI_PACKAGE_ID = process.env.NEXT_PUBLIC_NDI_PACKAGE_ID;
const REGISTRY_ID = process.env.NEXT_PUBLIC_NDI_REGISTRY_ID;

// BTNC (stablecoin) envs
const BTNC_PACKAGE_ID = process.env.NEXT_PUBLIC_BTNC_PACKAGE_ID;
const BTNC_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_BTNC_ADMIN_CAP_ID;
const BTNC_TREASURY_CAP_ID = process.env.NEXT_PUBLIC_BTNC_TREASURY_CAP_ID;

// signing keys (⚠️ must not be exposed to the browser)
const ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_ADMIN_KEY_B64 || "").trim();
const ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_ADMIN_KEY_HEX || "").trim();
const BTNC_ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_B64 || "").trim();
const BTNC_ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_HEX || "").trim();

const client = new SuiClient({ url: SUI_RPC });

// -----------------------------
// Utilities (units & secrets)
// -----------------------------
function hexToBytes(hex: string) {
  const clean = hex.replace(/^0x/i, "").trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error("hex key has odd length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(b)) throw new Error("hex key contains non-hex chars");
    out[i] = b;
  }
  return out;
}

function parseSecret({ b64, hex }: { b64?: string; hex?: string }) {
  if (b64) {
    let raw: Uint8Array;
    try {
      raw = fromBase64(b64.replace(/^"+|"+$/g, "").trim());
    } catch {
      throw new Error("base64 secret invalid");
    }
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`base64 decoded unexpected length: ${raw.length}`);
  }
  if (hex) {
    const raw = hexToBytes(hex.replace(/^"+|"+$/g, "").trim());
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`hex decoded unexpected length: ${raw.length}`);
  }
  throw new Error("missing admin secret");
}

// Default admin (KYC + BTNC default)
let _DEFAULT_ADMIN: Ed25519Keypair | undefined;
function getDefaultAdmin() {
  if (_DEFAULT_ADMIN) return _DEFAULT_ADMIN;
  const secret = parseSecret({ b64: ADMIN_KEY_B64, hex: ADMIN_KEY_HEX }) as Uint8Array;
  _DEFAULT_ADMIN = Ed25519Keypair.fromSecretKey(secret);
  console.log("[admin] default signer:", _DEFAULT_ADMIN.getPublicKey().toSuiAddress());
  return _DEFAULT_ADMIN;
}

// optional BTNC admin
let _BTNC_ADMIN: Ed25519Keypair | undefined;
function getBtncAdmin() {
  if (_BTNC_ADMIN) return _BTNC_ADMIN;
  if (BTNC_ADMIN_KEY_B64 || BTNC_ADMIN_KEY_HEX) {
    const secret = parseSecret({ b64: BTNC_ADMIN_KEY_B64, hex: BTNC_ADMIN_KEY_HEX }) as Uint8Array;
    _BTNC_ADMIN = Ed25519Keypair.fromSecretKey(secret);
    console.log("[admin] BTNC signer:", _BTNC_ADMIN.getPublicKey().toSuiAddress());
    return _BTNC_ADMIN;
  }
  _BTNC_ADMIN = getDefaultAdmin();
  return _BTNC_ADMIN;
}

// Units: tenths (decimals=1)
function toTenths(human: string | number) {
  if (typeof human === "number") {
    if (!Number.isFinite(human)) throw new Error("Invalid amount");
    const scaled = Math.round(human * 10);
    if (Math.abs(scaled - human * 10) > 1e-9) throw new Error("Only 1 decimal allowed");
    if (scaled <= 0) throw new Error("Amount must be > 0");
    return scaled;
  }
  const s = String(human).trim();
  if (!/^\d+(\.\d{1})?$/.test(s)) {
    if (/^\d+$/.test(s)) return parseInt(s, 10) * 10;
    throw new Error("Only integers or 1 decimal place allowed");
  }
  const [i, f = ""] = s.split(".");
  const tenths = parseInt(i, 10) * 10 + (f ? parseInt(f, 10) : 0);
  if (tenths <= 0) throw new Error("Amount must be > 0");
  return tenths;
}

function formatTenths(tenths: number | bigint | string) {
  const t = Number(tenths);
  if (!Number.isFinite(t)) return "0";
  const intPart = Math.trunc(t / 10);
  const frac = Math.abs(t % 10);
  return frac === 0 ? String(intPart) : `${intPart}.${frac}`;
}

// -----------------------------
// BTNC Coin helpers
// -----------------------------
function BTNCCoinType() {
  if (!BTNC_PACKAGE_ID) throw new Error("BTNC_PACKAGE_ID missing");
  return `${BTNC_PACKAGE_ID}::btnc::BTNC`;
}

export async function getAllCoins(owner: string, coinType: string) {
  let cursor: string | null = null;
  const out: any[] = [];
  while (true) {
    const r = await client.getCoins({ owner, coinType, cursor, limit: 200 });
    out.push(...r.data);
    if (!r.hasNextPage) break;
    cursor = r.nextCursor;
  }
  return out;
}

// -----------------------------
// Gas/topup
// -----------------------------
const SUI_COIN_TYPE = "0x2::sui::SUI";
const MIN_SUI_MIST = BigInt(process.env.MIN_SUI_MIST ?? 80_000_000);
const TOPUP_SUI_MIST = BigInt(process.env.TOPUP_SUI_MIST ?? 200_000_000);

async function getSuiBalanceMist(owner: string) {
  const b = await client.getBalance({ owner, coinType: SUI_COIN_TYPE });
  return BigInt(b?.totalBalance ?? "0");
}

async function fundSuiTo(address: string, amountMist: bigint) {
  const admin = getDefaultAdmin();
  const tx = new Transaction();
  const split = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist.toString())]);
  tx.transferObjects([split], tx.pure.address(address));
  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: admin,
    options: { showEffects: true },
  });
  return res.digest;
}

export async function fundSuiIfNeeded(address: string) {
  const bal = await getSuiBalanceMist(address);
  if (bal >= MIN_SUI_MIST) return null;
  return await fundSuiTo(address, TOPUP_SUI_MIST);
}

// -----------------------------
// Bond module interaction
// -----------------------------
function bondTarget(fn: string) {
  if (!BOND_PACKAGE_ID) throw new Error("BOND_PACKAGE_ID missing");
  return `${BOND_PACKAGE_ID}::bond_single::${fn}`;
}

async function signAndExecuteWith(signer: Ed25519Keypair, tx: Transaction) {
  return client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true, showEvents: true, showObjectChanges: true },
  });
}

// ---------------------------------------------------------
// create_series (primary series creation)
// ---------------------------------------------------------
export async function createBondSeries(params: {
  symbol: string;
  name: string;
  organizationName: string;
  bondType: BondType;
  faceValue: string | number; // 100.0 -> 1000 tenths
  totalUnits: string | number; // 150.0 -> 1500 tenths
  rateBps: number; // 1000 = 10%
  startMs: number; // ms since epoch
  maturityMs: number;
  subscriptionPeriodDays: number;
  purpose: string;
}) {
  const {
    symbol,
    name,
    organizationName,
    bondType,
    faceValue,
    totalUnits,
    rateBps,
    startMs,
    maturityMs,
    subscriptionPeriodDays,
    purpose,
  } = params;

  const supplyTenths = toTenths(totalUnits);
  const faceValueTenths = toTenths(faceValue);

  const admin = getDefaultAdmin();
  const tx = new Transaction();

  const symbolBytes = Array.from(Buffer.from(symbol, "utf8"));
  const nameBytes = Array.from(Buffer.from(name, "utf8"));

  tx.moveCall({
    target: `${BOND_SINGLE_MODULE}::create_series`,
    arguments: [
      tx.object(BOND_ADMIN_CAP_ID),
      tx.pure.vector("u8", symbolBytes),
      tx.pure.vector("u8", nameBytes),
      tx.pure.address(BOND_ISSUER_ADDRESS),
      tx.pure.u64(BigInt(supplyTenths)),
      tx.pure.u64(BigInt(faceValueTenths)),
      tx.pure.u64(BigInt(rateBps)),
      tx.pure.u64(BigInt(startMs)),
      tx.pure.u64(BigInt(maturityMs)),
    ],
  });

  const result = await signAndExecuteWith(admin, tx);

  // Extract Series object id
  let seriesId: string | null = null;
  for (const ch of result.objectChanges || []) {
    if (
      ch.type === "created" &&
      ch.objectType === `${BOND_SINGLE_MODULE}::Series`
    ) {
      seriesId = ch.objectId;
      break;
    }
  }

  const maturityDate = new Date(maturityMs);
  const subscriptionEndDate = new Date(
    new Date(startMs).getTime() + subscriptionPeriodDays * 24 * 3600 * 1000
  );

  const bond = await db.bonds.create({
    data: {
      bond_object_id: seriesId,
      bond_name: name,
      bond_type: bondType,
      bond_symbol: symbol,
      organization_name: organizationName,
      face_value: BigInt(faceValueTenths),
      tl_unit_offered: supplyTenths,
      tl_unit_subscribed: 0,
      maturity: maturityDate,
      status: Status.open,
      interest_rate: (rateBps / 100).toFixed(2), // "10.00"
      purpose,
      market: Market.current,
      subscription_period: subscriptionPeriodDays,
      subscription_end_date: subscriptionEndDate,
    },
  });

  // Optional event log
  await db.events
    .create({
      data: {
        type: EventType.subscription,
        bond_id: bond.id,
        user_id: bond.organization_name, // adjust if you have an admin user id
        details: "Bond series created",
        tx_hash: result.digest,
      },
    })
    .catch(() => {});

  return { ok: true, digest: result.digest, seriesId, bond };
}

// ---------------------------------------------------------
// subscribe (primary market deposit)
// corresponds to Move entry fun subscribe(...)
// ---------------------------------------------------------

/**
 * Low-level primary subscription: calls Move `subscribe`:
 *   public entry fun subscribe(
 *       registry: &ndi_kyc::Registry,
 *       series: &mut Series,
 *       mut payment: Coin<btnc::BTNC>,
 *       amount_tenths: u64,
 *       ctx: &mut TxContext
 *   )
 */

export async function subscribeToBond(
  bondId: string,
  seriesObjectId: string,
  {
    userId,
    walletAddress,
    mnemonics,
    subscription_amt,
  }: {
    userId: string;
    walletAddress: string;
    mnemonics: string;
    subscription_amt: string | number;
  }
) {
  // 1) Convert requested units to tenths (Move contract uses tenths)
  const amountTenths = toTenths(subscription_amt); // e.g. "15.0" -> 150

  // 2) Load all BTNC coins for this custodial wallet
  const coinType = BTNCCoinType();
  const coins = await getAllCoins(walletAddress, coinType);
  if (!coins.length) {
    throw new Error("No BTNC balance available for subscription");
  }
  const paymentCoinIds = coins.map((c: any) => c.coinObjectId);

  // 3) Call on-chain `subscribe` via subscribePrimary
  const res = await subscribePrimary({
    buyerMnemonic: mnemonics,
    buyerKeypair: undefined,          // we’re using mnemonic restore
    buyerAddress: walletAddress,
    seriesObjectId,                   // on-chain Series object id
    amountTenths,                     // bond quantity in tenths
    paymentCoinIds,                   // BTNC coins used to pay
    bondId,                           // DB bond id (for Subscriptions row)
    userId,                           // DB user id
  });

  // subscribePrimary already:
  // - writes Subscriptions
  // - updates Bonds.tl_unit_subscribed
  // - optionally writes Events

  return res; // { ok, tx, txHash, subscription, bond }
}

export async function subscribePrimary({
  buyerMnemonic,
  buyerKeypair,
  buyerAddress,
  seriesObjectId,
  amountTenths,
  paymentCoinIds,
  bondId,   // 👈 DB Bonds.id
  userId,   // 👈 DB Users.id
}: {
  buyerMnemonic?: string;
  buyerKeypair?: Ed25519Keypair;
  buyerAddress: string;
  seriesObjectId: string;
  amountTenths: number;      // bond quantity in tenths (10 => 1.0 unit)
  paymentCoinIds: string[];  // BTNC coin object IDs owned by buyer
  bondId: string;
  userId: string;
}) {
  if (!REGISTRY_ID) throw new Error("Registry id missing");

  // -------- signer (custodial user) ----------
  let signer: Ed25519Keypair;
  if (buyerKeypair) signer = buyerKeypair;
  else if (buyerMnemonic)
    signer = await restoreKeypairFromEncryptedMnemonic(buyerMnemonic);
  else throw new Error("buyer signer missing (mnemonic or keypair)");

  // -------- ensure gas ----------
  await fundSuiIfNeeded(buyerAddress);

  if (!paymentCoinIds.length) throw new Error("missing BTNC coin ids");

  // -------- build & send transaction ----------
  const tx = new Transaction();
  const primaryCoin = tx.object(paymentCoinIds[0]);
  if (paymentCoinIds.length > 1) {
    tx.mergeCoins(
      primaryCoin,
      paymentCoinIds.slice(1).map((id) => tx.object(id))
    );
  }

  tx.moveCall({
    target: bondTarget("subscribe"),
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(seriesObjectId),
      primaryCoin,
      tx.pure.u64(amountTenths.toString()),
    ],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });

  const txHash = res.digest;

  // -------- DB: record subscription + update bond ----------
  // amountTenths is bond quantity (tenths). We store it into committed_amount/subscription_amt.
   const subscription = await  db.subscriptions.create({
      data: {
        bond_id: bondId,
        user_id: userId,
        wallet_address: buyerAddress,
        committed_amount: BigInt(amountTenths),
        subscription_amt: BigInt(amountTenths),
        tx_hash: txHash,
      },
    })

  const updatedBond = await db.bonds.update({
      where: { id: bondId },
      data: {
        tl_unit_subscribed: {
          increment: amountTenths, // also tenths
        },
      },
    })

  // Optional: event log
  await db.events
    .create({
      data: {
        type: EventType.subscription,
        bond_id: bondId,
        user_id: userId,
        details: `Subscribed ${amountTenths} tenths`,
        tx_hash: txHash,
      },
    })
    .catch(() => {});

  return {
    ok: true,
    tx: res,
    txHash,
    subscription,
    bond: updatedBond,
  };
}

// ---------------------------------------------------------
// list_for_sale (secondary market)
// Move: list_for_sale(registry, &mut Series, amount_tenths, ctx): u64
// ---------------------------------------------------------
export async function listForSale({
  sellerMnemonic,
  sellerAddress,
  seriesObjectId,
  amountTenths,
}: {
  sellerMnemonic?: string;
  sellerAddress: string;
  seriesObjectId: string;
  amountTenths: number;
}) {
  if (!REGISTRY_ID) throw new Error("Registry id missing");

  // let signer: Ed25519Keypair;
  // if (sellerKeypair) signer = sellerKeypair;
  if (!sellerMnemonic){
    throw new Error("Seller Signer missing: Seller Mnemonic is undefined or Missing")
  }
  const signer = await restoreKeypairFromEncryptedMnemonic(sellerMnemonic);

  await fundSuiIfNeeded(sellerAddress);

  const tx = new Transaction();
  tx.moveCall({
    target: bondTarget("list_for_sale"),
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(seriesObjectId),
      tx.pure.u64(amountTenths.toString()),
    ],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });
  return res;
}

// ---------------------------------------------------------
// buy_listing (secondary market)
// Move: buy_listing(
//   registry: &ndi_kyc::Registry,
//   series: &mut Series,
//   listing_id: u64,
//   days_elapsed: u64,
//   payment: Coin<BTNC>,
//   ctx: &mut TxContext
// )
// We compute days_elapsed from on-chain start_ms and nowMs.
// ---------------------------------------------------------
export async function buyFromListing({
  buyerMnemonic,
  buyerKeypair,
  buyerAddress,
  seriesObjectId,
  listingId,
  paymentCoinIds,
  nowMs,
}: {
  buyerMnemonic?: string;
  buyerKeypair?: Ed25519Keypair;
  buyerAddress: string;
  seriesObjectId: string;
  listingId: number;
  paymentCoinIds: string[]; // BTNC coin ids owned by buyer
  nowMs: number; // client/server "now" in ms
}) {
  if (!REGISTRY_ID) throw new Error("Registry id missing");

  let signer: Ed25519Keypair;
  if (buyerKeypair) signer = buyerKeypair;
  else if (buyerMnemonic)
    signer = await restoreKeypairFromEncryptedMnemonic(buyerMnemonic);
  else throw new Error("buyer signer missing");

  await fundSuiIfNeeded(buyerAddress);

  if (!paymentCoinIds.length) throw new Error("missing BTNC coin ids");

  // Read series.start_ms to compute days_elapsed
  const seriesObj = await client.getObject({
    id: seriesObjectId,
    options: { showContent: true },
  });
  const startMs =
    Number(
      (seriesObj.data as any)?.content?.fields?.start_ms ?? 0
    ) || 0;
  const msPerDay = 86_400_000;
  const daysElapsed =
    startMs && nowMs > startMs
      ? Math.floor((nowMs - startMs) / msPerDay)
      : 0;

  const tx = new Transaction();
  const primaryCoin = tx.object(paymentCoinIds[0]);
  if (paymentCoinIds.length > 1) {
    tx.mergeCoins(
      primaryCoin,
      paymentCoinIds.slice(1).map((id) => tx.object(id))
    );
  }

  tx.moveCall({
    target: bondTarget("buy_listing"),
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(seriesObjectId),
      tx.pure.u64(listingId.toString()),
      tx.pure.u64(daysElapsed.toString()),
      primaryCoin,
    ],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });
  return res;
}
type BuyFromListInput = {
  buyerMnemonic : string;
  buyerKeypair : string;
  buyerAddress: string; 
  seriesObjectId : string;
  listingId : string;
  paymentCoinIds : string;
  nowMs : number
}

export  async  function buyAndPersist(input : BuyFromListInput){

}
// -----------------------------
// Read helpers
// -----------------------------
export async function getSeriesObject(seriesObjectId: string) {
  const obj = await client.getObject({
    id: seriesObjectId,
    options: { showContent: true },
  });
  if (!obj || !obj.data) throw new Error("Series object not found");
  return obj;
}

// NOTE: full table decoding (balances/listings) needs dynamic field reads,
// which you already have on the backend side. Here we keep things simple.
export async function getBalanceOf(seriesObjectId: string, ownerAddress: string) {
  const obj = await getSeriesObject(seriesObjectId);
  try {
    const fields = (obj.data as any).content.fields;
    return { maybe: "use backend dynamic field helper", obj, ownerAddress, fields };
  } catch (e: any) {
    return { error: "could not parse series object content", detail: e?.message ?? String(e) };
  }
}

export async function getListings(seriesObjectId: string) {
  const obj = await getSeriesObject(seriesObjectId);
  return { maybe: "use backend dynamic field helper for listings", obj };
}

// -----------------------------
// Price helpers (approx)
// -----------------------------
// function primaryPrice(faceValue: number, amountTenths: number) {
//   // face_value * tenths / 10
//   return Math.floor((faceValue * amountTenths) / 10);
// }

// export function secondaryPrice(
//   faceValue: number,
//   rateBps: number,
//   startMs: number,
//   nowMs: number,
//   amountTenths: number
// ) {
//   const face = primaryPrice(faceValue, amountTenths);
//   if (face === 0) return 0;
//   const msPerDay = 86_400_000;
//   const days = nowMs > startMs ? Math.floor((nowMs - startMs) / msPerDay) : 0;
//   const num = BigInt(face) * BigInt(rateBps) * BigInt(days);
//   const denom = BigInt(10_000) * BigInt(365);
//   const interest = (num + denom - BigInt(1)) / denom;
//   return Number(BigInt(face) + interest);
// }

// -----------------------------
// Mint BTNC helper
// -----------------------------
export async function mintBtncTo({
  recipient,
  tenths,
}: {
  recipient: string;
  tenths: number;
}) {
  if (!BTNC_PACKAGE_ID || !BTNC_ADMIN_CAP_ID || !BTNC_TREASURY_CAP_ID) {
    throw new Error("BTNC_* env missing (package/admin/treasury)");
  }
  if (!Number.isInteger(tenths) || tenths <= 0)
    throw new Error("tenths must be positive integer");
  const signer = getBtncAdmin();

  async function tryOrder(order: "addr-first" | "amount-first") {
    const tx = new Transaction();
    if (order === "addr-first") {
      tx.moveCall({
        target: `${BTNC_PACKAGE_ID}::btnc::mint`,
        arguments: [
          tx.object(BTNC_ADMIN_CAP_ID),
          tx.object(BTNC_TREASURY_CAP_ID),
          tx.pure.address(recipient),
          tx.pure.u64(tenths.toString()),
        ],
      });
    } else {
      tx.moveCall({
        target: `${BTNC_PACKAGE_ID}::btnc::mint`,
        arguments: [
          tx.object(BTNC_ADMIN_CAP_ID),
          tx.object(BTNC_TREASURY_CAP_ID),
          tx.pure.u64(tenths.toString()),
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
    const res = await tryOrder("addr-first");
    return res.digest;
  } catch (e: any) {
    const msg = `${e?.message || ""} ${e?.cause?.executionErrorSource || ""}`;
    const likelyTypeMismatch =
      msg.includes("expects u64") ||
      msg.includes("InvalidBCSBytes") ||
      msg.includes("CommandArgumentError") ||
      msg.includes("BCS");
    if (!likelyTypeMismatch) throw e;
    const res2 = await tryOrder("amount-first");
    return res2.digest;
  }
}



// Admin Functions 

export default async function allocateBond(seriesId : string, algorithm : string) {
  try {
    if(!BOND_PACKAGE_ID){
      console.log("Bond package id not present")
    }

    if (!seriesId || !algorithm) {
      return "seriesId and algorithm are required"
    }

    const admin = getDefaultAdmin();
    const adminAddr = admin.getPublicKey().toSuiAddress();

    // Admin must hold enough BTNC for refunds.
    const coinType = BTNCCoinType();
    const coins = await getAllCoins(adminAddr, coinType);
    if (!coins.length) {
      return "admin_has_no_btnc_for_refunds"
    }
    const primaryId = coins[0].coinObjectId;
    const otherIds = coins.slice(1).map((c) => c.coinObjectId);

    const tx = new Transaction();
    const primary = tx.object(primaryId);
    if (otherIds.length) {
      tx.mergeCoins(
        primary,
        otherIds.map((id) => tx.object(id))
      );
    }

    if (algorithm === "equal") {
      tx.moveCall({
        target: `${BOND_SINGLE_MODULE}::finalize_allocation_equal`,
        arguments: [tx.object(BOND_ADMIN_CAP_ID), tx.object(seriesId), primary],
      });
    } else if (algorithm === "prorata") {
      tx.moveCall({
        target: `${BOND_SINGLE_MODULE}::finalize_allocation_prorata`,
        arguments: [tx.object(BOND_ADMIN_CAP_ID), tx.object(seriesId), primary],
      });
    } else {
      return "algorithm must be 'equal' or 'prorata'"
    }

    const result = await signAndExecuteWith(admin, tx);

    return result.digest
  } catch (err) {
    console.error("/bond/finalize error:", err);
    
  }
}

// Helper to make sure Sui object id is sane
function isValidSuiObjectId(id: string) {
  return /^0x[0-9a-fA-F]{64}$/.test(id);
}

// Main function: takes a Bond row, runs on-chain allocation, stores Allocations
export async function allocateBondAndPersist(
  bond,
  algorithm: 'equal' | 'prorata'
) {
  if (!bond.bond_object_id) {
    throw new Error(`Bond ${bond.id} has no bond_object_id (Sui Series object id)`);
  }
  const seriesId = bond.bond_object_id;

  if (!isValidSuiObjectId(seriesId)) {
    throw new Error(`Invalid Sui object id for bond_object_id: ${seriesId}`);
  }

  // 1. Execute on-chain allocation
  const digest = await allocateBond(seriesId, algorithm);

  // 2. Fetch tx with events from Sui
  const txBlock = await client.waitForTransaction({
    digest,
    options: { showEvents: true },
  });

  const events = txBlock.events ?? [];

  // 3. Filter AllocationFor events
  const allocationEvents = events
    .filter((e) =>
      // Adjust this to match your fully qualified event type
      e.type.endsWith('bond_single::AllocationFor')
    )
    .map((e) => e.parsedJson as {
      series_id: string;
      user: string;
      allocated_tenths: string | number;
    })
    .filter((e) => e.series_id === seriesId);

  // 4. Write them into Allocations table
  for (const ev of allocationEvents) {
    const wallet = ev.user;
    const allocatedTenths = BigInt(ev.allocated_tenths as any);

    // Map wallet_address -> Users.id
    const user = await db.users.findUnique({
      where: { wallet_address: wallet },
    });

    if (!user) {
      console.warn('No user found for wallet', wallet, '— skipping allocation row');
      continue;
    }

    await db.bonds.updateMany({
      where: {id : bond.id},
      data:{
        allocated: true
      }
    })

    await db.allocations.create({
      data: {
        bond_id: bond.id,
        user_id: user.id,
        wallet_address: wallet,
        allocated_tenths: allocatedTenths,
        tx_hash: digest,
      },
    });
  }

  return {
    digest,
    allocations: allocationEvents,
  };
}




export async function fetchInvestorAllocations(userId: string): Promise<Row[]> {
  const allocations = await db.allocations.findMany({
    where: { user_id: userId },
    include: {
      bond: true, // includes Bonds row
    },
  });

  return allocations.map((a) => {
    const b = a.bond;
    return {
      bondId: b.id,
      seriesObjectId: b.bond_object_id!, // assume allocated bonds always have this
      name: b.bond_name,
      ratePct: parseFloat(b.interest_rate), // if you store "0.05" as string
      total: Number(a.allocated_tenths) / 10, // convert tenths -> units
      maturity: new Date(b.maturity).toLocaleDateString("en-GB"), // DD/MM/YYYY
      status: "up" as const, // you can derive later if you want
    };
  });
}


type ListForSaleInput = {
  userId: string;          // DB Users.id
  bondId: string;          // DB Bonds.id
  sellerAddress: string;   // wallet
  sellerMnemonic?: string; // encrypted mnemonic in DB
  sellerKeypair?: Ed25519Keypair;
  seriesObjectId: string;  // Sui Series object id
  amountUnits: number;     // human units, e.g. 1.5 => 1.5 bond
};

export async function listForSaleAndPersist(input: ListForSaleInput) {
  const {
    userId,
    bondId,
    sellerAddress,
    sellerMnemonic,
    seriesObjectId,
    amountUnits,
  } = input;

  // 1. Convert to tenths
  const amountTenths = Math.round(amountUnits * 10);

  // 2. Check allocation (does investor hold that much?)
  const alloc = await db.allocations.findFirst({
    where: {
      bond_id: bondId,
      user_id: userId,
      wallet_address: sellerAddress,
    },
  });

  if (!alloc || Number(alloc.allocated_tenths) < amountTenths) {
    throw new Error("Not enough units to list for sale");
  }

  // 3. Call chain
  const res = await listForSale({
    sellerMnemonic,
    sellerAddress,
    seriesObjectId,
    amountTenths,
  });

  const digest = res.digest;

  // 4. Read the `Listed` event from the tx
  const tx = await client.waitForTransaction({
    digest,
    options: { showEvents: true },
  });

  const events = tx.events ?? [];
  const listedEvent = events
    .filter((e) =>
      e.type.endsWith("bond_single::Listed")
    )
    .map((e) => e.parsedJson as {
      series_id: string;
      listing_id: string | number;
      seller: string;
      amount_tenths: string | number;
    })
    .find((e) => e.seller === sellerAddress);

  if (!listedEvent) {
    throw new Error("No Listed event found for this seller");
  }

  const listingOnchainId = Number(listedEvent.listing_id);
  const listedAmountTenths = BigInt(listedEvent.amount_tenths as any);

  // 5. DB: create listing + reduce seller allocation in a transaction
  const [listing] = await db.$transaction([
    db.listings.create({
      data: {
        bond_id: bondId,
        seller_user_id: userId,
        seller_wallet: sellerAddress,
        listing_onchain: listingOnchainId,
        amount_tenths: listedAmountTenths,
        tx_hash: digest,
        status: "open",
      },
    }),
    db.allocations.update({
      where: { id: alloc.id },
      data: {
        allocated_tenths: {
          decrement: listedAmountTenths,
        },
      },
    }),
  ]);

  return {
    ok: true,
    digest,
    listing,
  };
}


export async function fetchOpenListings() {
  const listings = await db.listings.findMany({
    where: { status: "open" },
    include: { bond: true, seller: true },
    orderBy: { created_at: "desc" },
  });

  return listings.map((l) => ({
    id: l.id,
    bondId: l.bond_id,
    listingOnchain: l.listing_onchain,
    sellerWallet: l.seller_wallet,
    amountUnits: Number(l.amount_tenths) / 10,
    bondName: l.bond.bond_name,
    interestRate: l.bond.interest_rate,
    maturity: new Date(l.bond.maturity).toLocaleDateString("en-GB"),
  }));
}


export async function fetchResaleBonds(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;

  const listings = await db.listings.findMany({
    where: { status: "open" },
    include: {
      bond: true,
    },
    orderBy: { created_at: "desc" },
    skip,
    take: pageSize,
  });

  return listings.map((l) => ({
    id: l.id, // listing id (for key)
    bond_id: l.bond_id,
    bond_name: l.bond.bond_name,
    interest_rate: l.bond.interest_rate,
    tl_unit_offered: l.bond.tl_unit_offered,
    tl_unit_subscribed: Number(l.amount_tenths) / 10, // units in this listing
    face_value: Number(l.bond.face_value),
    market: "resale" as Market,
    seller: l.seller_wallet,
    price: Number(l.bond.face_value),
    listing_onchain: Number(l.listing_onchain)
    // you can add seller, price, etc. here too
  }));
}


export async function fetchResaleListingById(listingId: string) {
  if (!listingId) {
    throw new Error("fetchResaleListingById: listingId is required");
  }

  // IMPORTANT: use findUnique + id
  const listing = await db.listings.findUnique({
    where: { id: listingId },
    include: {
      bond: true,   // so you have listing.bond.*
      seller: true, // optional
    },
  });

  if (!listing) {
    throw new Error(`Listing not found for id=${listingId}`);
  }

  return listing;
}
