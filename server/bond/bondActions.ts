// src/lib/bondService.ts
import "dotenv/config";
import { PrismaClient, BondType, Status, Market, Type as EventType } from "@prisma/client"; // adjust path
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import { db } from "@/server/db"
// ------------------------------------------------------------------
// Prisma & Sui setup
// ------------------------------------------------------------------


const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl("testnet");
const suiClient = new SuiClient({ url: SUI_RPC });

// ------------------------------------------------------------------
// Env / contract config
// ------------------------------------------------------------------
const NDI_PACKAGE_ID = process.env.NDI_PACKAGE_ID!;
const REGISTRY_ID = process.env.REGISTRY_ID!; // ndi_kyc::Registry object id

const BOND_PACKAGE_ID = process.env.BOND_PACKAGE_ID!;
const BOND_SINGLE_MODULE = `${BOND_PACKAGE_ID}::bond_single`;
const BOND_ADMIN_CAP_ID = process.env.BOND_ADMIN_CAP_ID!;
const BOND_ISSUER_ADDRESS = process.env.BOND_ISSUER_ADDRESS!;

const BTNC_PACKAGE_ID = process.env.BTNC_PACKAGE_ID!;
const BTNC_ADMIN_CAP_ID = process.env.BTNC_ADMIN_CAP_ID!;
const BTNC_TREASURY_CAP_ID = process.env.BTNC_TREASURY_CAP_ID!;

const ADMIN_KEY_B64 = (process.env.ADMIN_KEY_B64 || "").trim();
const ADMIN_KEY_HEX = (process.env.ADMIN_KEY_HEX || "").trim();

const BTNC_ADMIN_KEY_B64 = (process.env.BTNC_ADMIN_KEY_B64 || "").trim();
const BTNC_ADMIN_KEY_HEX = (process.env.BTNC_ADMIN_KEY_HEX || "").trim();

// ------------------------------------------------------------------
// Key helpers
// ------------------------------------------------------------------
function hexToBytes(hex: string): Uint8Array {
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

function parseSecret({ b64, hex }: { b64?: string; hex?: string }): Uint8Array {
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

let _DEFAULT_ADMIN: Ed25519Keypair | undefined;
function getDefaultAdmin(): Ed25519Keypair {
  if (_DEFAULT_ADMIN) return _DEFAULT_ADMIN;
  const secret = parseSecret({ b64: ADMIN_KEY_B64, hex: ADMIN_KEY_HEX });
  _DEFAULT_ADMIN = Ed25519Keypair.fromSecretKey(secret);
  return _DEFAULT_ADMIN;
}

let _BTNC_ADMIN: Ed25519Keypair | undefined;
function getBtncAdmin(): Ed25519Keypair {
  if (_BTNC_ADMIN) return _BTNC_ADMIN;
  if (BTNC_ADMIN_KEY_B64 || BTNC_ADMIN_KEY_HEX) {
    const secret = parseSecret({
      b64: BTNC_ADMIN_KEY_B64,
      hex: BTNC_ADMIN_KEY_HEX,
    });
    _BTNC_ADMIN = Ed25519Keypair.fromSecretKey(secret);
    return _BTNC_ADMIN;
  }
  _BTNC_ADMIN = getDefaultAdmin();
  return _BTNC_ADMIN;
}

// ------------------------------------------------------------------
// Units & formatting (tenths)
// ------------------------------------------------------------------
export function toTenths(human: string | number): number {
  if (typeof human === "number") {
    if (!Number.isFinite(human)) throw new Error("Invalid amount");
    const scaled = Math.round(human * 10);
    if (Math.abs(scaled - human * 10) > 1e-9)
      throw new Error("Only 1 decimal allowed");
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

export function formatTenths(tenths: number | bigint | string) {
  const t = Number(tenths);
  if (!Number.isFinite(t)) return '0';
  const intPart = Math.trunc(t / 10);
  const frac = Math.abs(t % 10);
  return frac === 0 ? String(intPart) : `${intPart}.${frac}`;
}

// ------------------------------------------------------------------
// SUI coin helpers (BTNC, SUI, gas)
// ------------------------------------------------------------------
function BTNCCoinType() {
  if (!BTNC_PACKAGE_ID) throw new Error("BTNC_PACKAGE_ID missing");
  return `${BTNC_PACKAGE_ID}::btnc::BTNC`;
}

async function getAllCoins(owner: string, coinType: string) {
  let cursor: string | null = null;
  const out: Awaited<ReturnType<typeof suiClient.getCoins>>["data"] = [];
  while (true) {
    const r = await suiClient.getCoins({ owner, coinType, cursor, limit: 200 });
    out.push(...r.data);
    if (!r.hasNextPage) break;
    cursor = r.nextCursor;
  }
  return out;
}

const SUI_COIN_TYPE = "0x2::sui::SUI";
const MIN_SUI_MIST = BigInt(process.env.MIN_SUI_MIST ?? 80_000_000);
const TOPUP_SUI_MIST = BigInt(process.env.TOPUP_SUI_MIST ?? 200_000_000);

async function getSuiBalanceMist(owner: string) {
  const b = await suiClient.getBalance({ owner, coinType: SUI_COIN_TYPE });
  return BigInt(b?.totalBalance ?? "0");
}

async function fundSuiTo(address: string, amountMist: bigint) {
  const admin = getDefaultAdmin();
  const tx = new Transaction();
  const split = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist.toString())]);
  tx.transferObjects([split], tx.pure.address(address));
  const res = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: admin,
    options: { showEffects: true },
  });
  return res.digest;
}

async function fundSuiIfNeeded(address: string) {
  const bal = await getSuiBalanceMist(address);
  if (bal >= MIN_SUI_MIST) return null;
  return fundSuiTo(address, TOPUP_SUI_MIST);
}

// ------------------------------------------------------------------
// Generic Sui call helper
// ------------------------------------------------------------------
async function signAndExecuteWith(signer: Ed25519Keypair, tx: Transaction) {
  return suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true, showEvents: true, showObjectChanges: true },
  });
}

// ------------------------------------------------------------------
// DB helpers: custodials & mapping requestId -> user/wallet
// ------------------------------------------------------------------
async function getCustodialForRequestId(requestId: string) {
  const ekyc = await db.eKYCVerifications.findFirst({
    where: { request_id: requestId },
  });
  if (!ekyc || !ekyc.custodial_address) {
    throw new Error("session_invalid_or_not_verified");
  }
  const wallet = await db.custodialWallets.findUnique({
    where: { address: ekyc.custodial_address },
  });
  if (!wallet) throw new Error("custodial_key_missing");

  const raw = Buffer.from(wallet.secret_key, "base64");
  const kp = Ed25519Keypair.fromSecretKey(new Uint8Array(raw));

  return {
    userId: ekyc.user_id,
    custodialAddress: wallet.address,
    keypair: kp,
  };
}

// ------------------------------------------------------------------
// Small helper to decode u64 from dynamic-field BCS
// ------------------------------------------------------------------
function decodeU64FromBcs(value: any): bigint {
  if (value == null) return 0n;
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return 0n;
    return BigInt(Math.floor(value));
  }
  if (typeof value === "bigint") return value >= 0n ? value : 0n;
  if (typeof value === "string") {
    const s = value.trim();
    if (/^\d+$/.test(s)) return BigInt(s);
  }
  if (value instanceof Uint8Array || Array.isArray(value)) {
    const bytes = value instanceof Uint8Array ? value : Uint8Array.from(value);
    let out = 0n;
    for (let i = 0; i < bytes.length; i++) {
      out |= BigInt(bytes[i]) << (8n * BigInt(i));
    }
    return out;
  }
  try {
    const bytes = fromB64(String(value));
    let out = 0n;
    for (let i = 0; i < bytes.length; i++) {
      out |= BigInt(bytes[i]) << (8n * BigInt(i));
    }
    return out;
  } catch {
    return 0n;
  }
}

// ==================================================================
//  BOND API FUNCTIONS (to use from Next.js)
// ==================================================================

// -----------------------------------------------------------
// 1) CREATE SERIES  ->  move call: create_series
// -----------------------------------------------------------
export async function createBondSeries(params: {
  symbol: string;
  name: string;
  organizationName: string;
  bondType: BondType;
  faceValue: string | number;      // 100.0 -> 1000 tenths
  totalUnits: string | number;     // 150.0 -> 1500 tenths
  rateBps: number;                 // 1000 = 10%
  startMs: number;                 // ms since epoch
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
  await db.events.create({
    data: {
      type: EventType.subscription,
      bond_id: bond.id,
      user_id: bond.organization_name, // or some admin user; adjust as needed
      details: "Bond series created",
      tx_hash: result.digest,
    },
  }).catch(() => {});

  return { ok: true, digest: result.digest, seriesId, bond };
}

// -----------------------------------------------------------
// 2) READ SERIES ON-CHAIN (Series struct)
// -----------------------------------------------------------
export async function getBondSeriesOnChain(seriesId: string) {
  const obj = await suiClient.getObject({ id: seriesId, options: { showContent: true } });

  if (!obj.data || obj.data.content?.dataType !== "moveObject") {
    throw new Error("not_move_object");
  }
  if (obj.data.content.type !== `${BOND_SINGLE_MODULE}::Series`) {
    throw new Error("not_series_type");
  }

  const f: any = obj.data.content.fields;
  const meta = await db.bonds.findFirst({
    where: { bond_object_id: seriesId },
  });

  return {
    ok: true,
    seriesId,
    symbol: meta?.bond_symbol || "<unknown>",
    name: meta?.bond_name || "<unknown>",
    issuer: f.issuer,
    supplyTenths: String(f.supply_tenths),
    supplyUnits: formatTenthsFromBigInt(String(f.supply_tenths)),
    soldTenths: String(f.sold_tenths),
    soldUnits: formatTenthsFromBigInt(String(f.sold_tenths)),
    faceValueTenths: String(f.face_value_tenths),
    faceValueUnits: formatTenthsFromBigInt(String(f.face_value_tenths)),
    rateBps: Number(f.rate_bps),
    startMs: Number(f.start_ms),
    maturityMs: Number(f.maturity_ms),
    subscriptionOpen: Boolean(f.subscription_open),
    allocationDone: Boolean(f.allocation_done),
  };
}

// -----------------------------------------------------------
// 3) HOLDER BALANCE FOR A SERIES (principal in tenths)
// -----------------------------------------------------------
export async function getBondPositionForSeries(params: {
  seriesId: string;
  address?: string;
  requestId?: string;
}) {
  const { seriesId } = params;
  let owner = params.address;

  if (!owner && params.requestId) {
    const { custodialAddress } = await getCustodialForRequestId(params.requestId);
    owner = custodialAddress;
  }
  if (!owner) throw new Error("missing_address");

  const seriesObj = await suiClient.getObject({
    id: seriesId,
    options: { showContent: true },
  });

  const content: any = seriesObj.data?.content;
  if (!content || content.dataType !== "moveObject") {
    throw new Error("not_a_series_object");
  }

  const fields = content.fields || {};
  const balancesField = fields.balances;
  const balancesId =
    balancesField?.fields?.id?.id ??
    balancesField?.fields?.id ??
    balancesField?.id ??
    null;

  if (!balancesId) {
    return {
      seriesId,
      address: owner,
      principalTenths: "0",
      principalHuman: "0",
    };
  }

  let principalBig = 0n;
  try {
    const df = await suiClient.getDynamicFieldObject({
      parentId: balancesId,
      name: { type: "address", value: owner },
    });

    const rawVal =
      (df as any)?.data?.bcs?.fields?.value ??
      (df as any)?.data?.content?.fields?.value;

    principalBig = decodeU64FromBcs(rawVal);
  } catch {
    principalBig = 0n;
  }

  return {
    seriesId,
    address: owner,
    principalTenths: principalBig.toString(),
    principalHuman: formatTenthsFromBigInt(principalBig),
  };
}

// -----------------------------------------------------------
// 4) SUBSCRIBE PRIMARY (entry fun subscribe)
// -----------------------------------------------------------
export async function subscribeBond(params: {
//   requestId: string;
  seriesId: string;       // on-chain Series object id
  bondId: string;         // DB Bonds.id
  amountUnits: string | number; // 10.0 -> 100 tenths
}) {
  const { seriesId, bondId, amountUnits } = params;

  const { userId, custodialAddress, keypair } =
    await getCustodialForRequestId(requestId);

  await fundSuiIfNeeded(custodialAddress);

  const amountTenths = toTenths(amountUnits);
  const coinType = BTNCCoinType();

  const coins = await getAllCoins(custodialAddress, coinType);
  if (!coins.length) throw new Error("no_btnc");

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

  tx.moveCall({
    target: `${BOND_SINGLE_MODULE}::subscribe`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(seriesId),
      primary,
      tx.pure.u64(amountTenths),
    ],
  });

  const result = await signAndExecuteWith(keypair, tx);

  // Record subscription DB-side
  await prisma.subscriptions.create({
    data: {
      bond_id: bondId,
      user_id: userId,
      wallet_address: custodialAddress,
      committed_amount: BigInt(amountTenths),
      subscription_amt: BigInt(amountTenths),
      tx_hash: result.digest,
    },
  });

  // Update total subscribed
  await prisma.bonds.update({
    where: { id: bondId },
    data: {
      tl_unit_subscribed: { increment: amountTenths },
    },
  });

  await prisma.events.create({
    data: {
      type: EventType.subscription,
      bond_id: bondId,
      user_id: userId,
      details: `Subscribed ${amountTenths} tenths`,
      tx_hash: result.digest,
    },
  }).catch(() => {});

  return { ok: true, digest: result.digest, subscriber: custodialAddress };
}

// -----------------------------------------------------------
// 5) FINALIZE ALLOCATION (equal / pro-rata)
//     finalize_allocation_equal / finalize_allocation_prorata
// -----------------------------------------------------------
export async function finalizeBondAllocation(params: {
  seriesId: string;
  bondId: string;
  algorithm: "equal" | "prorata";
}) {
  const { seriesId, bondId, algorithm } = params;

  const admin = getDefaultAdmin();
  const adminAddr = admin.getPublicKey().toSuiAddress();

  const coinType = BTNCCoinType();
  const coins = await getAllCoins(adminAddr, coinType);
  if (!coins.length) throw new Error("admin_has_no_btnc_for_refunds");

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
  } else {
    tx.moveCall({
      target: `${BOND_SINGLE_MODULE}::finalize_allocation_prorata`,
      arguments: [tx.object(BOND_ADMIN_CAP_ID), tx.object(seriesId), primary],
    });
  }

  const result = await signAndExecuteWith(admin, tx);

  await prisma.events.create({
    data: {
      type: EventType.subscription,
      bond_id: bondId,
      user_id: BOND_ISSUER_ADDRESS,
      details: `Allocation finalized (${algorithm})`,
      tx_hash: result.digest,
    },
  }).catch(() => {});

  return { ok: true, digest: result.digest };
}

// -----------------------------------------------------------
// 6) LIST FOR SALE (secondary) -> list_for_sale
// -----------------------------------------------------------
export async function listBondForSale(params: {
  requestId: string;
  seriesId: string;       // on-chain Series id
  bondId: string;         // DB Bond id
  amountUnits: string | number;
}) {
  const { requestId, seriesId, bondId, amountUnits } = params;

  const { userId, custodialAddress, keypair } =
    await getCustodialForRequestId(requestId);
  await fundSuiIfNeeded(custodialAddress);

  const amountTenths = toTenths(amountUnits);

  const tx = new Transaction();
  tx.moveCall({
    target: `${BOND_SINGLE_MODULE}::list_for_sale`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(seriesId),
      tx.pure.u64(amountTenths),
    ],
  });

  const result = await signAndExecuteWith(keypair, tx);

  // Extract listing_id event from Listed
  let onchainListingId: bigint | null = null;
  let sellerEvt: string | null = null;
  let amountEvt: bigint | null = null;

  for (const ev of result.events || []) {
    if (ev.type === `${BOND_SINGLE_MODULE}::Listed`) {
      const pj: any = ev.parsedJson || {};
      const rawId = pj.listing_id ?? pj.listingId;
      onchainListingId = rawId != null ? BigInt(rawId) : null;
      sellerEvt = pj.seller ?? null;
      const rawAmt = pj.amount_tenths ?? pj.amountTenths;
      amountEvt = rawAmt != null ? BigInt(rawAmt) : null;
      break;
    }
  }

  if (onchainListingId == null) {
    return {
      ok: true,
      digest: result.digest,
      note: "Listed on-chain but could not parse listing id from events",
    };
  }

  const listing = await prisma.bondListings.create({
    data: {
      bond_id: bondId,
      onchain_listing_id: onchainListingId,
      seller_address: sellerEvt || custodialAddress,
      amount_tenths: amountEvt ?? BigInt(amountTenths),
    },
  });

  await prisma.events.create({
    data: {
      type: EventType.transfer,
      bond_id: bondId,
      user_id: userId,
      details: `Listed ${listing.amount_tenths} tenths for sale`,
      tx_hash: result.digest,
    },
  }).catch(() => {});

  return {
    ok: true,
    digest: result.digest,
    listing: {
      id: listing.id,
      onchainListingId: listing.onchain_listing_id.toString(),
      seller: listing.seller_address,
      amountTenths: listing.amount_tenths.toString(),
      amountUnits: formatTenthsFromBigInt(listing.amount_tenths),
    },
  };
}

export async function getListingsForBond(bondId: string) {
  const listings = await prisma.bondListings.findMany({ where: { bond_id: bondId } });
  return {
    ok: true,
    listings: listings.map((l) => ({
      listingId: l.onchain_listing_id.toString(),
      seller: l.seller_address,
      amountTenths: l.amount_tenths.toString(),
      amountUnits: formatTenthsFromBigInt(l.amount_tenths),
    })),
  };
}

// -----------------------------------------------------------
// 7) BUY LISTING (secondary) -> buy_listing
// -----------------------------------------------------------
export async function buyBondListing(params: {
  requestId: string;
  seriesId: string;          // on-chain Series id
  bondId: string;            // DB Bond id
  onchainListingId: string | number;
  daysElapsed: number;
}) {
  const { requestId, seriesId, bondId, onchainListingId, daysElapsed } = params;

  const { userId, custodialAddress, keypair } =
    await getCustodialForRequestId(requestId);
  await fundSuiIfNeeded(custodialAddress);

  const coinType = BTNCCoinType();
  const coins = await getAllCoins(custodialAddress, coinType);
  if (!coins.length) throw new Error("no_btnc");

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

  tx.moveCall({
    target: `${BOND_SINGLE_MODULE}::buy_listing`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(seriesId),
      tx.pure.u64(BigInt(onchainListingId)),
      tx.pure.u64(BigInt(daysElapsed)),
      primary,
    ],
  });

  const result = await signAndExecuteWith(keypair, tx);

  // Remove listing from DB
  await prisma.bondListings.deleteMany({
    where: {
      bond_id: bondId,
      onchain_listing_id: BigInt(onchainListingId),
    },
  });

  await prisma.transactions.create({
    data: {
      bond_id: bondId,
      user_from: userId, // refine if you also track seller's user_id
      user_to: userId,
      tx_hash: result.digest,
    },
  }).catch(() => {});

  await prisma.events.create({
    data: {
      type: EventType.transfer,
      bond_id: bondId,
      user_id: userId,
      details: `Bought listing ${onchainListingId}`,
      tx_hash: result.digest,
    },
  }).catch(() => {});

  return {
    ok: true,
    digest: result.digest,
    buyer: custodialAddress,
  };
}
