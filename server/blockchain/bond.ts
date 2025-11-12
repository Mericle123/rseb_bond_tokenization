/* sui/bondClient.ts
   Client helpers for bond_tokenization::bond_single Move module.

   Usage pattern matches your sample: uses @mysten/sui/client and
   Transaction building/signing via Ed25519Keypair signers.
*/

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/sui/utils';
import { restoreKeypairFromEncryptedMnemonic } from './suiclient'; // reuse your helper
import { error } from 'console';
// re-use helpers from your sample where possible (toTenths, formatTenths, BTNCCoinType, getAllCoins, fundSuiIfNeeded)

const PORT = process.env.PORT || 3001;
const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl('testnet');

// Bond package / module envs
const BOND_PACKAGE_ID = process.env.NEXT_PUBLIC_BOND_PACKAGE_ID; // e.g. "0xabc..."
// Admin cap (object id) for bond admin (create_series)
const BOND_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_BOND_ADMIN_CAP_ID;
const BOND_UPGRADE_CAP_ID = process.env.NEXT_PUBLIC_BOND_UPGRRADE_CAP_ID


// KYC registry (ndi_kyc)
const NDI_PACKAGE_ID = process.env.NEXT_PUBLIC_NDI_PACKAGE_ID;
const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID;

// BTNC (stablecoin) envs (used for primary/secondary payments)
const BTNC_PACKAGE_ID = process.env.NEXT_PUBLIC_BTNC_PACKAGE_ID;
const BTNC_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_BTNC_ADMIN_CAP_ID;
const BTNC_TREASURY_CAP_ID = process.env.NEXT_PUBLIC_BTNC_TREASURY_CAP_ID;

// signing keys
const ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_ADMIN_KEY_B64 || '').trim();
const ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_ADMIN_KEY_HEX || '').trim();
const BTNC_ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_B64 || '').trim();
const BTNC_ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_HEX || '').trim();

const client = new SuiClient({ url: SUI_RPC });

// -----------------------------
// Utilities (units & secrets)
// -----------------------------
function hexToBytes(hex: string) {
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
function parseSecret({ b64, hex }: { b64?: string; hex?: string }) {
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

// Default admin (KYC + BTNC default)
let _DEFAULT_ADMIN: Ed25519Keypair | undefined;
export function getDefaultAdmin() {
  if (_DEFAULT_ADMIN) return _DEFAULT_ADMIN;
  const secret = parseSecret({ b64: ADMIN_KEY_B64, hex: ADMIN_KEY_HEX }) as Uint8Array;
  _DEFAULT_ADMIN = Ed25519Keypair.fromSecretKey(secret);
  console.log('[admin] default signer:', _DEFAULT_ADMIN.getPublicKey().toSuiAddress());
  return _DEFAULT_ADMIN;
}
// optional BTNC admin
let _BTNC_ADMIN: Ed25519Keypair | undefined;
function getBtncAdmin() {
  if (_BTNC_ADMIN) return _BTNC_ADMIN;
  if (BTNC_ADMIN_KEY_B64 || BTNC_ADMIN_KEY_HEX) {
    const secret = parseSecret({ b64: BTNC_ADMIN_KEY_B64, hex: BTNC_ADMIN_KEY_HEX }) as Uint8Array;
    _BTNC_ADMIN = Ed25519Keypair.fromSecretKey(secret);
    console.log('[admin] BTNC signer:', _BTNC_ADMIN.getPublicKey().toSuiAddress());
    return _BTNC_ADMIN;
  }
  _BTNC_ADMIN = getDefaultAdmin();
  return _BTNC_ADMIN;
}

// Units: tenths (decimals=1)
export function toTenths(human: string | number) {
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
export function formatTenths(tenths: number | bigint | string) {
  const t = Number(tenths);
  if (!Number.isFinite(t)) return '0';
  const intPart = Math.trunc(t / 10);
  const frac = Math.abs(t % 10);
  return frac === 0 ? String(intPart) : `${intPart}.${frac}`;
}

// -----------------------------
// BTNCCoin helpers (re-used)
// -----------------------------
function BTNCCoinType() {
  if (!BTNC_PACKAGE_ID) throw new Error('BTNC_PACKAGE_ID missing');
  return `${BTNC_PACKAGE_ID}::btnc::BTNC`;
}
export async function getAllCoins(owner: string, coinType: string) {
  let cursor = null;
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
// Gas/topup (copy from sample)
// -----------------------------
const SUI_COIN_TYPE = '0x2::sui::SUI';
const MIN_SUI_MIST = BigInt(process.env.MIN_SUI_MIST ?? 80_000_000);
const TOPUP_SUI_MIST = BigInt(process.env.TOPUP_SUI_MIST ?? 200_000_000);

async function getSuiBalanceMist(owner: string) {
  const b = await client.getBalance({ owner, coinType: SUI_COIN_TYPE });
  return BigInt(b?.totalBalance ?? '0');
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
// Move module path: `${BOND_PACKAGE_ID}::bond_single::<fn>`
// Typical Move targets used below:
// - create_series: `${BOND_PACKAGE_ID}::bond_single::create_series`
// - buy_primary: `${BOND_PACKAGE_ID}::bond_single::buy_primary`
// - list_for_sale: `${BOND_PACKAGE_ID}::bond_single::list_for_sale`
// - buy_from_listing: `${BOND_PACKAGE_ID}::bond_single::buy_from_listing`
// We also read Series object using client.getObject

function bondTarget(fn: string) {
  if (!BOND_PACKAGE_ID) throw new Error('BOND_PACKAGE_ID missing');
  return `${BOND_PACKAGE_ID}::bond_single::${fn}`;
}

export async function mintBond({symbol, name, faceValue, rateBps, tenureDays, issuerAddress, startMs,  totalSupplyTenths} : any){
    try{
        const transaction = await createSeries({symbol, name, faceValue, rateBps, tenureDays, issuerAddress, startMs,  totalSupplyTenths})
        if (!transaction){
            console.log("Error here")
            throw new Error("Bond Mint failed")
        }
        console.log("mintBondTransaction: ", transaction)
        return transaction
    }
    catch(error){
        return error
    }
}

// create_series (admin only)
export async function createSeries({
  symbol,
  name,
  faceValue, // whole units in BTNC base units (u64)
  rateBps,
  tenureDays,
  issuerAddress,
  startMs,
  totalSupplyTenths, // u64: tenths cap
}: {
  symbol: string;
  name: string;
  faceValue: number;
  rateBps: number;
  tenureDays: number;
  issuerAddress: string;
  startMs: number;
  totalSupplyTenths: number;
}) {
  if (!BOND_ADMIN_CAP_ID) throw new Error('BOND_ADMIN_CAP_ID missing (admin cap object id)');
  const signer = getDefaultAdmin();

  const tx = new Transaction();
  tx.moveCall({
    target: bondTarget('create_series'),
    arguments: [
      tx.object(BOND_ADMIN_CAP_ID),
      tx.pure.string(symbol),
      tx.pure.string(name),
      tx.pure.u64(faceValue.toString()),
      tx.pure.u64(rateBps.toString()),
      tx.pure.u64(tenureDays.toString()),
      tx.pure.address(issuerAddress),
      tx.pure.u64(startMs.toString()),
      tx.pure.u64(totalSupplyTenths.toString()),
    ],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });

  const createdObjects = res.effects?.created;


  if (!createdObjects || createdObjects.length === 0) {
  throw new Error("No objects were created in this transaction");
}

// Assuming the first created object is your Series
const seriesObjectId = createdObjects[0].reference.objectId;

console.log("Created Series Object ID:", seriesObjectId);
// console.log("transaction result: ", res.effects?.created)
  
return seriesObjectId;
}


export async function subBond({buyerMnemonic, buyerKeypair, buyerAddress, seriesObjectId, amountTenths, paymentCoinIds} : any){
    try{
        const transaction = await buyPrimary({buyerMnemonic, buyerKeypair, buyerAddress, seriesObjectId, amountTenths, paymentCoinIds})        
            if (!transaction){
            console.log("Error here")
            throw new Error("Bond Mint failed")
        }
        console.log("mintBondTransaction: ", transaction)
        return transaction
    }
    catch(error){
        console.log("Bond Sub Error")
        return error
    }
}
// buy_primary
// buyer must pass BTNC coin object id(s) to pay; we merge/split coins in tx and call buy_primary
// paymentCoinIds: array of coin object ids owned by buyer (use getAllCoins to find them).
export async function buyPrimary({
  buyerMnemonic, // optional: if you want to sign as buyer
  buyerKeypair, // optional: Ed25519Keypair instance (if you already have)
  buyerAddress, // required: Sui address of buyer (sender)
  seriesObjectId, // Series object id
  amountTenths, // number u64
  paymentCoinIds, // array of coin objectIds that are BTNC coins belonging to buyer
}: {
  buyerMnemonic?: string;
  buyerKeypair?: Ed25519Keypair;
  buyerAddress: string;
  seriesObjectId: string;
  amountTenths: number;
  paymentCoinIds: string[];
}) {
  if (!BTNC_PACKAGE_ID || !BTNC_ADMIN_CAP_ID || !BTNC_TREASURY_CAP_ID) {
    throw new Error('BTNC_* env missing (package/admin/treasury)');
  }
  if (!REGISTRY_ID) throw new Error('Registry id missing');

  // signer for buyer
  let signer: any;
  if (buyerKeypair) signer = buyerKeypair;
  else if (buyerMnemonic) signer = await restoreKeypairFromEncryptedMnemonic(buyerMnemonic);
  else throw new Error('buyer signer missing (mnemonic or keypair)');

  // ensure buyer has SUI for gas
  await fundSuiIfNeeded(buyerAddress);

  // Build transaction: merge provided BTNC coins into primary, split price (we don't know price client-side easily)
  // Approach: merge all provided coins, then call buy_primary with the merged coin object as payment (Move will check price and split/return change)
  const tx = new Transaction();
  
  if (paymentCoinIds.length === 0) throw new Error('missing BTNC coin ids');

  const primaryCoin = tx.object(paymentCoinIds[0]);
  if (paymentCoinIds.length > 1) {
    tx.mergeCoins(primaryCoin, paymentCoinIds.slice(1).map((id) => tx.object(id)));
  }

  // Call buy_primary: arguments: series, payment: Coin<BTNC>, amount_tenths, registry, ctx
  tx.moveCall({
    target: bondTarget('buy_primary'),
    arguments: [
      tx.object(seriesObjectId),
      primaryCoin, // the merged coin object will be used as payment
      tx.pure.u64(amountTenths.toString()),
      tx.object(REGISTRY_ID),
    ],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });
  return res;
}

// list_for_sale
export async function listForSale({
  sellerMnemonic,
  sellerKeypair,
  sellerAddress,
  seriesObjectId,
  amountTenths,
}: {
  sellerMnemonic?: string;
  sellerKeypair?: Ed25519Keypair;
  sellerAddress: string;
  seriesObjectId: string;
  amountTenths: number;
}) {
  let signer: any;
  if (sellerKeypair) signer = sellerKeypair;
  else if (sellerMnemonic) signer = await restoreKeypairFromEncryptedMnemonic(sellerMnemonic);
  else throw new Error('seller signer missing');

  await fundSuiIfNeeded(sellerAddress);

  const tx = new Transaction();
  tx.moveCall({
    target: bondTarget('list_for_sale'),
    arguments: [tx.object(seriesObjectId), tx.pure.u64(amountTenths.toString()), tx.object(REGISTRY_ID!)],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });
  return res;
}

// buy_from_listing
export async function buyFromListing({
  buyerMnemonic,
  buyerKeypair,
  buyerAddress,
  seriesObjectId,
  listingId,
  amountTenths,
  paymentCoinIds,
  nowMs,
}: {
  buyerMnemonic?: string;
  buyerKeypair?: Ed25519Keypair;
  buyerAddress: string;
  seriesObjectId: string;
  listingId: number;
  amountTenths: number;
  paymentCoinIds: string[]; // BTNC coin ids owned by buyer
  nowMs: number;
}) {
  if (!BTNC_PACKAGE_ID) throw new Error('BTNC_PACKAGE_ID missing');
  let signer: any;
  if (buyerKeypair) signer = buyerKeypair;
  else if (buyerMnemonic) signer = await restoreKeypairFromEncryptedMnemonic(buyerMnemonic);
  else throw new Error('buyer signer missing');

  await fundSuiIfNeeded(buyerAddress);

  if (paymentCoinIds.length === 0) throw new Error('missing BTNC coin ids');

  const tx = new Transaction();
  const primaryCoin = tx.object(paymentCoinIds[0]);
  if (paymentCoinIds.length > 1) {
    tx.mergeCoins(primaryCoin, paymentCoinIds.slice(1).map((id) => tx.object(id)));
  }

  tx.moveCall({
    target: bondTarget('buy_from_listing'),
    arguments: [
      tx.object(seriesObjectId),
      tx.pure.u64(listingId.toString()),
      primaryCoin,
      tx.pure.u64(amountTenths.toString()),
      tx.pure.u64(nowMs.toString()),
      tx.object(REGISTRY_ID!),
    ],
  });

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true },
  });
  return res;
}

// -----------------------------
// Read helpers: query Series object & tables
// -----------------------------
// The Series Move struct contains 'holdings' and 'listings' tables. We can fetch the Series object
// and then read fields. Depending on the Sui indexing node and how tables are stored, you may need
// to read table objects by their id. Here we do an approach that fetches the Series object and returns
// on-chain field values (best-effort).
export async function getSeriesObject(seriesObjectId: string) {
  const obj = await client.getObject({ id: seriesObjectId });
  if (!obj || !obj.data) throw new Error('Series object not found');
  return obj;
}

// Convenience: fetch holdings for an owner by reading the Series object then reading tables (best-effort)
export async function getBalanceOf(seriesObjectId: string, ownerAddress: string) {
  const obj = await getSeriesObject(seriesObjectId);
  // Best-effort parse: Move object content not guaranteed consistent across providers; the Move VM stores tables as Table objects.
  // We attempt to read Move object fields if available in obj.data.content.fields
  try {
    const fields = (obj.data as any).content.fields;
    // fields may contain 'holdings' as a table id or Move call representation; try Sui SDK getDynamicFieldObject (table lookup)
    // If holdings is a Sui table (dynamic fields), client.getDynamicFields can be used for table id. We attempt a few heuristics.
    // If not possible, return undefined to indicate caller should fetch via indexer.
    return { maybe: 'use indexer to read tables', obj };
  } catch (e) {
    return { error: 'could not parse series object content', detail: e?.message ?? String(e) };
  }
}

// fetch listings: best-effort (see note above)
export async function getListings(seriesObjectId: string) {
  const obj = await getSeriesObject(seriesObjectId);
  return { maybe: 'use indexer to read table listings', obj };
}

// -----------------------------
// Client-side price helpers (duplicate Move logic)
// -----------------------------
export function primaryPrice(faceValue: number, amountTenths: number) {
  // face_value * tenths / 10
  return Math.floor((faceValue * amountTenths) / 10);
}
export function secondaryPrice(faceValue: number, rateBps: number, startMs: number, nowMs: number, amountTenths: number) {
  const face = primaryPrice(faceValue, amountTenths);
  if (face === 0) return 0;
  const msPerDay = 86_400_000;
  const days = nowMs > startMs ? Math.floor((nowMs - startMs) / msPerDay) : 0;
  const num = BigInt(face) * BigInt(rateBps) * BigInt(days);
  const denom = BigInt(10_000) * BigInt(365);
  const interest = (num + denom - BigInt(1)) / denom;
  return Number(BigInt(face) + interest);
}

// -----------------------------
// Helper: mint BTNC to recipient (re-using your sample's mintBtncTo try-order pattern)
// -----------------------------
export async function mintBtncTo({ recipient, tenths }: { recipient: string; tenths: number }) {
  if (!BTNC_PACKAGE_ID || !BTNC_ADMIN_CAP_ID || !BTNC_TREASURY_CAP_ID) {
    throw new Error('BTNC_* env missing (package/admin/treasury)');
  }
  if (!Number.isInteger(tenths) || tenths <= 0) throw new Error('tenths must be positive integer');
  const signer = getBtncAdmin();

  async function tryOrder(order: 'addr-first' | 'amount-first') {
    const tx = new Transaction();
    if (order === 'addr-first') {
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
    const res = await tryOrder('addr-first');
    return res.digest;
  } catch (e: any) {
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
// Exports for convenience
// -----------------------------
export default {
  createSeries,
  buyPrimary,
  listForSale,
  buyFromListing,
  getSeriesObject,
  getBalanceOf,
  getListings,
  mintBtncTo,
  toTenths,
  formatTenths,
  primaryPrice,
  secondaryPrice,
};
