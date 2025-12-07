  //  Client helpers for bond_tokenization::bond_single Move module.
"use server"


import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { restoreKeypairFromEncryptedMnemonic } from "./suiclient";
import { BondType, Status, Market, Type as EventType } from "@prisma/client";
import { db } from "@/server/db";
import { formatBtnFromTenths, getDefaultAdmin, getBtncAdmin, toTenths } from "../lib/helpers";

type Status = "up" | "down" | "flat";

const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl("testnet");

// Bond package / module envs
const BOND_PACKAGE_ID = process.env.NEXT_PUBLIC_BOND_PACKAGE_ID;
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


const client = new SuiClient({ url: SUI_RPC });


// -----------------------------
// BTNC Coin helpers
// -----------------------------

// -----------------------------
// Gas/topup
// -----------------------------
const SUI_COIN_TYPE = "0x2::sui::SUI";
const MIN_SUI_MIST = BigInt(process.env.MIN_SUI_MIST ?? 80_000_000);
const TOPUP_SUI_MIST = BigInt(process.env.TOPUP_SUI_MIST ?? 200_000_000);

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
      allocated: false,
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
  const amountTenths = toTenths(subscription_amt);

  const coinType = BTNCCoinType();
  const coins = await getAllCoins(walletAddress, coinType);
  if (!coins.length) {
    throw new Error("No BTNC balance available for subscription");
  }
  const paymentCoinIds = coins.map((c: any) => c.coinObjectId);

  const res = await subscribePrimary({
    buyerMnemonic: mnemonics,
    buyerKeypair: undefined,
    buyerAddress: walletAddress,
    seriesObjectId,
    amountTenths,
    paymentCoinIds,
    bondId,
    userId,
  });

  return {
    ...res,
    subscribedTenths: amountTenths,
    subscribedHuman: formatBtnFromTenths(amountTenths),
  };
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
        details: `Subscribed ${amountTenths / 10} units`,
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
  // signer / wallet
  buyerMnemonic?: string;
  buyerKeypair?: Ed25519Keypair;
  buyerAddress: string;

  // on-chain series + listing
  seriesObjectId: string;
  listingOnchainId: number; // Sui listing_id (u64)
  nowMs: number;

  // DB linking
  listingDbId: string;      // Listings.id
  buyerUserId: string;      // Users.id
};

export async function buyAndPersist(input: BuyFromListInput) {
  const {
    buyerMnemonic,
    buyerKeypair,
    buyerAddress,
    seriesObjectId,
    listingOnchainId,
    nowMs,
    listingDbId,
    buyerUserId,
  } = input;

  // 1) Load listing + bond + seller from DB
  const listing = await db.listings.findUnique({
    where: { id: listingDbId },
    include: {
      bond: true,
      seller: true,
    },
  });

  if (!listing) {
    throw new Error(`Listing not found for id=${listingDbId}`);
  }

  if (listing.status !== "open") {
    throw new Error(`Listing ${listingDbId} is not open`);
  }

  const bond = listing.bond;
  const sellerUser = listing.seller;

  // 2) Collect BTNC coins from buyer wallet
  const coinType = BTNCCoinType();
  const coins = await getAllCoins(buyerAddress, coinType);
  if (!coins.length) {
    throw new Error("No BTNC balance available to buy from listing");
  }
  const paymentCoinIds = coins.map((c: any) => c.coinObjectId);

  // 3) Call on-chain buy_listing
  const res = await buyFromListing({
    buyerMnemonic,
    buyerKeypair,
    buyerAddress,
    seriesObjectId,
    listingId: listingOnchainId,
    paymentCoinIds,
    nowMs,
  });

  const digest = res.digest;

  // 4) Persist DB changes in a transaction:
  //    - mark listing as FILLED
  //    - create allocation for buyer
  //    - create peer-to-peer transaction record
  //    - optional: create event logs
  const listedAmountTenths = listing.amount_tenths; // BigInt

  const [updatedListing, buyerAlloc, p2pTx] = await db.$transaction([
    // 4a) Mark listing as filled
    db.listings.update({
      where: { id: listingDbId },
      data: {
        status: "filled",
        tx_hash: digest,
      },
    }),

    // 4b) Create / increment buyer allocation
    (async () => {
      // Check if buyer already has an allocation row for this bond + wallet
      const existingAlloc = await db.allocations.findFirst({
        where: {
          bond_id: bond.id,
          user_id: buyerUserId,
          wallet_address: buyerAddress,
        },
      });

      if (existingAlloc) {
        return db.allocations.update({
          where: { id: existingAlloc.id },
          data: {
            allocated_tenths: {
              increment: listedAmountTenths,
            },
            tx_hash: digest,
          },
        });
      }

      // No existing allocation – create new
      return db.allocations.create({
        data: {
          bond_id: bond.id,
          user_id: buyerUserId,
          wallet_address: buyerAddress,
          allocated_tenths: listedAmountTenths,
          tx_hash: digest,
        },
      });
    })() as any,

    // 4c) Peer-to-peer transaction record
    db.transactions.create({
      data: {
        user_from: sellerUser.id,
        user_to: buyerUserId,
        tx_hash: digest,
      },
    }),
  ]);

  // 5) Optional events (buy/sell)
  await Promise.all([
    db.events.create({
      data: {
        type: EventType.transfer,
        bond_id: bond.id,
        user_id: buyerUserId,
        details: `Bought ${Number(listedAmountTenths) / 10} units from ${sellerUser.wallet_address}`,
        tx_hash: digest,
      },
    }).catch(() => {}),

    db.events.create({
      data: {
        type: EventType.transfer,
        bond_id: bond.id,
        user_id: sellerUser.id,
        details: `Sold ${Number(listedAmountTenths) / 10} units to ${buyerAddress}`,
        tx_hash: digest,
      },
    }).catch(() => {}),
  ]);

  return {
    ok: true,
    digest,
    listing: updatedListing,
    allocation: buyerAlloc,
    transaction: p2pTx,
  };
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




export async function acceptNegotiationOfferAndBuy(params: {
  offerId: string;
  buyerUserId: string;
  buyerAddress: string;
  buyerMnemonic?: string;
}) {
  const { offerId, buyerUserId, buyerAddress, buyerMnemonic } = params;

  // 1) Load offer + listing + bond + seller + buyer
  const offer = await db.negotiationOffers.findUnique({
    where: { id: offerId },
    include: {
      bond: true,
      listing: {
        include: {
          bond: true,
          seller: true,
        },
      },
      buyer: true,
      seller: true,
    },
  });

  if (!offer) throw new Error(`Negotiation offer not found: ${offerId}`);
  if (offer.status !== "pending") {
    throw new Error(`Offer ${offerId} is not pending`);
  }

  const listing = offer.listing;
  if (!listing) throw new Error("Offer has no listing relation");
  if (listing.status !== "open") {
    throw new Error("Listing is not open");
  }

  const bond = listing.bond;
  if (!bond.bond_object_id) {
    throw new Error("Bond has no bond_object_id (series object id)");
  }

  // For now, assume buyer is taking the FULL listing amount (simple plan).
  // If you want partial fills (units < listing units), you must adjust
  // the requested amount and (in future) on-chain logic / DB updates.
  // Here, we enforce full listing purchase for safety:
  const listingUnits = Number(listing.amount_tenths) / 10;
  if (offer.units !== listingUnits) {
    // You can relax this later, but for now keep it strict:
    throw new Error(
      `Offer units (${offer.units}) must match listing units (${listingUnits}) for acceptance in plan 2`
    );
  }

  const seriesObjectId = bond.bond_object_id;
  const nowMs = Date.now();

  // 2) Run buy + persist (generic resale pipeline)
  const result = await buyAndPersist({
    buyerMnemonic,
    buyerKeypair: undefined,
    buyerAddress,
    seriesObjectId,
    listingOnchainId: listing.listing_onchain,
    nowMs,
    listingDbId: listing.id,
    buyerUserId,
  });

  const digest = result.digest;

  // 3) Update offer status + optionally cancel other offers on same listing
  await db.$transaction([
    db.negotiationOffers.update({
      where: { id: offerId },
      data: {
        status: "accepted",
        tx_hash: digest,
      },
    }),

    db.negotiationOffers.updateMany({
      where: {
        listing_id: listing.id,
        id: { not: offerId },
        status: "pending",
      },
      data: {
        status: "cancelled",
      },
    }),
  ]);

  return {
    ok: true,
    digest,
    listing: result.listing,
    allocation: result.allocation,
    transaction: result.transaction,
  };
}
