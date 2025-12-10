"use server"

import { db } from "@/server/db"
import { BondType, Market, Status } from "@prisma/client";
import { formatBtnFromTenths, formatDMY, nfUnits, tenthsToUnits, toTenths } from "../lib/helpers";
import { acceptNegotiationOfferAndBuy } from "../blockchain/bond";
import { fetchNegotiationOffersForUser, NegotiationOfferDTO } from "../lib/negotiations";


export async function fetchInvestorAllocations(userId: string): Promise<Row[]> {
  const allocations = await db.allocations.findMany({
    where: { user_id: userId },
    include: {
      bond: true,
    },
  });

  return allocations.map((a) => {
    const b = a.bond;
    const totalUnits = tenthsToUnits(a.allocated_tenths); // tenths -> units
    const ratePct = parseFloat(b.interest_rate);          // e.g. "10.00" -> 10

    return {
      bondId: b.id,
      seriesObjectId: b.bond_object_id!, // assume allocated bonds always have this
      name: b.bond_name,
      ratePct,                           // numeric 10
      // readable variants (if your Row type allows extra fields)
      total: totalUnits,                 // 150.0 etc.
      // totalLabel: formatUnitsFromTenths(a.allocated_tenths),   // "150.0" formatted
      maturity: formatDMY(b.maturity),   // "1st November 2025"
      // maturityRaw: b.maturity,        // keep if you want raw date too
      status: "up" as const,
    };
  });
}



export async function fetchOpenListings() {
  const listings = await db.listings.findMany({
    where: { status: "open" },
    include: { bond: true, seller: true },
    orderBy: { created_at: "desc" },
  });

  return listings.map((l) => {
    const amountUnits = tenthsToUnits(l.amount_tenths);
    const faceValueUnits = tenthsToUnits(l.bond.face_value);

    return {
      id: l.id,
      bondId: l.bond_id,
      listingOnchain: l.listing_onchain,
      sellerWallet: l.seller_wallet,

      // numeric
      amountUnits,                      // 1.5, 10.0 etc.
      faceValue: faceValueUnits,        // price per unit (numeric)

      // nicely formatted labels
      amountUnitsLabel: nfUnits.format(amountUnits),       // "1.5", "10.0" with commas
      faceValueLabel: formatBtnFromTenths(l.bond.face_value), // "100.00" BTN etc.

      bondName: l.bond.bond_name,
      interestRate: l.bond.interest_rate,                 // e.g. "10.00"
      maturity: formatDMY(l.bond.maturity),
    };
  });
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

  return listings.map((l) => {
    const totalOfferedUnits = tenthsToUnits(l.bond.tl_unit_offered);
    const listingUnits = tenthsToUnits(l.amount_tenths);
    const faceValueUnits = tenthsToUnits(l.bond.face_value);

    return {
      id: l.id, // listing id (for key)
      bond_id: l.bond_id,
      bond_name: l.bond.bond_name,
      interest_rate: l.bond.interest_rate,

      // numeric units
      tl_unit_offered: totalOfferedUnits,  // total units offered in series
      tl_unit_subscribed: listingUnits,    // units in this particular listing

      // formatted labels (if UI wants them directly)
      tl_unit_offered_label: nfUnits.format(totalOfferedUnits),
      tl_unit_subscribed_label: nfUnits.format(listingUnits),

      // face value & price per unit (human)
      face_value: faceValueUnits,
      price: faceValueUnits,
      face_value_label: formatBtnFromTenths(l.bond.face_value),

      market: "resale" as Market,
      seller: l.seller_wallet,
      listing_onchain: Number(l.listing_onchain),
    };
  });
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


export async function fetchEventLogs(userId: string) {
  const logs = await db.events.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return logs.map((ev) => ({
    ...ev,
    createdAtLabel: formatDMY(ev.created_at),
    // if you have numeric amount fields on events, format them similarly:
    // amountLabel: ev.amount_tenths ? formatBtnFromTenths(ev.amount_tenths) : null,
  }));
}

export async function fetchInvestorEarnings(userId: string) {
  const allocations = await db.allocations.findMany({
    where: { user_id: userId },
    include: {
      bond: true,
    },
    orderBy: { created_at: "desc" },
  });

  const now = new Date();

  return allocations.map((a) => {
    const b = a.bond;

    // Units allocated (human units)
    const units = tenthsToUnits(a.allocated_tenths);        // e.g. 150.0
    const faceValuePerUnit = tenthsToUnits(b.face_value);   // e.g. 100.0 BTN per unit
    const totalInvestment = units * faceValuePerUnit;       // Nu amount

    // Interest rate: stored as "10.00" => 10 (%)
    const ratePct = parseFloat(b.interest_rate || "0");     // numeric 10

    // Interest from allocation date to now
    const allocationDate = a.created_at;
    const msPerDay = 86_400_000;
    const daysHeld = Math.max(
      0,
      Math.floor((now.getTime() - allocationDate.getTime()) / msPerDay)
    );

    const interestAccruedRaw =
      totalInvestment * (ratePct / 100) * (daysHeld / 365);

    const interestAccrued = Math.round(interestAccruedRaw); // round to nearest Nu

    // Very simple status logic – you can make this smarter later
    const status =
      interestAccrued > 0 ? ("up" as const) : ("flat" as const);

    return {
      id: a.id,                                // allocation id
      name: b.bond_name,
      ratePct: ratePct / 100,                  // 0.10 for 10% (UI multiplies by 100)
      interestAccrued,
      maturity: formatDMY(b.maturity),
      status,
      purchaseDate: formatDMY(allocationDate),
      bondType: b.bond_type,
      faceValue: faceValuePerUnit,
      totalInvestment,
    };
  });
}

const msPerDay = 86_400_000;

export type EarningDetail = {
  id: string;
  bondName: string;
  bondSymbol: string | null;
  bondType: string | null;
  ratePct: number;              // e.g. 10  => 10%
  interestAccrued: number;      // Nu
  maturityLabel: string;        // "25th December 2026"
  purchaseDateLabel: string;    // formatted allocation date
  purchaseDateISO: string;      // raw ISO for charts
  faceValue: number;            // Nu per unit
  unitsAllocated: number;       // human units
  totalInvestment: number;      // principal in Nu
};

export async function fetchEarningDetail(allocationId: string): Promise<EarningDetail> {
  const allocation = await db.allocations.findUnique({
    where: { id: allocationId },
    include: { bond: true },
  });

  if (!allocation || !allocation.bond) {
    throw new Error("Allocation or Bond not found");
  }

  const b = allocation.bond;

  const unitsAllocated = tenthsToUnits(allocation.allocated_tenths);
  const faceValue = tenthsToUnits(b.face_value);          // Nu per unit
  const totalInvestment = unitsAllocated * faceValue;

  const ratePct = parseFloat(b.interest_rate || "0");     // e.g. "10.00" -> 10

  const allocationDate = allocation.created_at;
  const now = new Date();
  const daysHeld = Math.max(
    1,
    Math.floor((now.getTime() - allocationDate.getTime()) / msPerDay)
  );

  const dailyInterest = (totalInvestment * (ratePct / 100)) / 365;
  const interestAccrued = Math.round(dailyInterest * daysHeld);

  return {
    id: allocation.id,
    bondName: b.bond_name,
    bondSymbol: b.bond_symbol,
    bondType: b.bond_type,
    ratePct,
    interestAccrued,
    maturityLabel: formatDMY(b.maturity),
    purchaseDateLabel: formatDMY(allocationDate),
    purchaseDateISO: allocationDate.toISOString(),
    faceValue,
    unitsAllocated,
    totalInvestment,
  };
}

export async function fetchEventLogsforCurrentUser(userid : string) {
  // if (!userid) return [];
  
  const logs = await fetchEventLogs(userid);
  return  logs
}




export async function fetchPendingSubscriptionsForUser(userId: string) {
  // 1) get all this user's subscriptions (with bond info)
  const [subs, allocs] = await Promise.all([
    db.subscriptions.findMany({
      where: { user_id: userId },
      include: {
        bond: true,
      },
      orderBy: { created_at: "desc" },
    }),
    db.allocations.findMany({
      where: { user_id: userId },
      select: { bond_id: true },
    }),
  ]);

  // 2) collect bond_ids the user ALREADY has allocations for
  const allocatedBondIds = new Set(allocs.map((a) => a.bond_id));

  // 3) keep only subscriptions whose bond has NO allocation for this user
  const pending = subs.filter((s) => !allocatedBondIds.has(s.bond_id));

  // 4) map into a nice DTO for the frontend (and avoid BigInt serialization issues)
  return pending.map((s) => ({
    id: s.id,
    created_at: s.created_at.toISOString(),
    wallet_address: s.wallet_address,

    committed_amount: Number(s.committed_amount), // assuming safe range
    subscription_amt: s.subscription_amt ? Number(s.subscription_amt) : null,

    bond: {
      id: s.bond.id,
      bond_name: s.bond.bond_name,
      bond_symbol: s.bond.bond_symbol,
      organization_name: s.bond.organization_name,
      interest_rate: s.bond.interest_rate,     // string in schema
      face_value: Number(s.bond.face_value),   // BigInt → number
      maturity: s.bond.maturity.toISOString(),
      status: s.bond.status,
      subscription_end_date: s.bond.subscription_end_date.toISOString(),
    },
  }));
}



// 1) Peer-to-peer bond transfers (Transactions table)
export async function fetchPeerToPeerTxForCurrentUser(userId: string) {
  const txs = await db.transactions.findMany({
    where: {
      OR: [{ user_from: userId }, { user_to: userId }],
    },
    orderBy: { created_at: "desc" },
  });

  return txs.map((tx) => ({
    id: tx.id,
    created_at: tx.created_at.toISOString(),
    tx_hash: tx.tx_hash,
    direction: tx.user_from === userId ? "out" : "in",
  }));
}

// 2) Allocation history (Allocations table)
export async function fetchAllocationHistoryForCurrentUser(userId: string) {
  const allocs = await db.allocations.findMany({
    where: { user_id: userId },
    include: {
      bond: true,
    },
    orderBy: { created_at: "desc" },
  });

  return allocs.map((a) => ({
    id: a.id,
    created_at: a.created_at.toISOString(),
    tx_hash: a.tx_hash,
    units: Number(a.allocated_tenths) / 10, // tenths -> units
    bond: {
      id: a.bond.id,
      bond_name: a.bond.bond_name,
      bond_symbol: a.bond.bond_symbol,
      organization_name: a.bond.organization_name,
    },
  }));
}

// 3) (Optional) Bond buy / sell history (primary + resale)
export async function fetchBondBuySellHistoryForCurrentUser(userId: string) {
  // Primary subscriptions (user buys from issuer)
  const subs = await db.subscriptions.findMany({
    where: { user_id: userId },
    include: { bond: true },
    orderBy: { created_at: "desc" },
  });

  // Resale buys / sells via Transactions
  const txs = await db.transactions.findMany({
    where: {
      OR: [{ user_from: userId }, { user_to: userId }],
    },
    include: { bond: true },
    orderBy: { created_at: "desc" },
  });

  const primary = subs.map((s) => ({
    id: s.id,
    created_at: s.created_at.toISOString(),
    tx_hash: s.tx_hash,
    kind: "buy" as const,
    amount: Number(s.committed_amount),
    bond: {
      id: s.bond.id,
      bond_name: s.bond.bond_name,
      bond_symbol: s.bond.bond_symbol,
      organization_name: s.bond.organization_name,
    },
    source: "subscription" as const,
  }));

  const resale = txs.map((t) => ({
    id: t.id,
    created_at: t.created_at.toISOString(),
    tx_hash: t.tx_hash,
    kind: t.user_from === userId ? ("sell" as const) : ("buy" as const),
    bond: {
      id: t.bond.id,
      bond_name: t.bond.bond_name,
      bond_symbol: t.bond.bond_symbol,
      organization_name: t.bond.organization_name,
    },
    source: "resale" as const,
  }))}

  export type CreateNegotiationOfferInput = {
  listingId: string;
  buyerUserId: string;
  buyerWallet: string;

  // how many units the buyer wants (integer units for now)
  units: number;

  // negotiation economics
  proposedInterestRate: number;  // e.g. 8.5 (%)
  proposedTotalAmountNu: number; // Nu, human value (e.g. 950.0)

  note?: string;
};

export async function createNegotiationOffer(input: CreateNegotiationOfferInput) {
  const {
    listingId,
    buyerUserId,
    buyerWallet,
    units,
    proposedInterestRate,
    proposedTotalAmountNu,
    note,
  } = input;

  if (!listingId) throw new Error("listingId is required");
  if (units <= 0) throw new Error("units must be > 0");

  // 1) Load listing + bond + seller
  const listing = await db.listings.findUnique({
    where: { id: listingId },
    include: {
      bond: true,
      seller: true,
    },
  });

  if (!listing) throw new Error(`Listing not found for id=${listingId}`);
  if (listing.status !== "open") throw new Error("Listing is not open");

  const bond = listing.bond;

  // 2) Check units <= listing amount (simple constraint)
  const listingUnits = Number(listing.amount_tenths) / 10;
  if (units > listingUnits) {
    throw new Error(
      `Requested units (${units}) exceed listing units (${listingUnits})`
    );
  }

  // 3) Convert to tenths & amount in tenths
  const unitsTenths = BigInt(units * 10); // integer units * 10
  const proposedTotalAmountTenths = BigInt(proposedTotalAmountNu * 100);

  const originalRate = parseFloat(bond.interest_rate || "0");

  // 4) Store offer
  const offer = await db.negotiationOffers.create({
    data: {
      bond_id: bond.id,
      listing_id: listing.id,
      buyer_user_id: buyerUserId,
      seller_user_id: listing.seller_user_id,

      buyer_wallet: buyerWallet,
      seller_wallet: listing.seller_wallet,

      units,
      units_tenths: unitsTenths,

      original_interest_rate: originalRate,
      proposed_interest_rate: proposedInterestRate,
      proposed_total_amount: proposedTotalAmountTenths,

      status: "pending",
      note,
    },
    include: {
      bond: true,
      listing: true,
    },
  });

  return offer;
}

export async function createOfferAction(form: {
  listingId: string;
  buyerUserId: string;
  buyerWallet: string;
  units: number;
  proposedInterestRate: number;
  proposedTotalAmountNu: number;
  note?: string;
}) {
  return await createNegotiationOffer(form);
}


export async function acceptOfferAction({
  offerId,
  buyerUserId,
  buyerAddress,
  buyerMnemonic,
}: {
  offerId: string;
  buyerUserId: string;
  buyerAddress: string;
  buyerMnemonic: string;
}) {
  return await acceptNegotiationOfferAndBuy({
    offerId,
    buyerUserId,
    buyerAddress,
    buyerMnemonic,
  });
}


export async function fetchOffersForListing(
  listingId: string,
  currentUserId?: string
): Promise<NegotiationOfferDTO[]> {
  if (!listingId) throw new Error("listingId is required");

  const offers = await db.negotiationOffers.findMany({
    where: { listing_id: listingId },
    include: {
      bond: true,
      listing: true,
      buyer: true,
      seller: true,
    },
    orderBy: { created_at: "desc" },
  });

  return offers.map((o) => {
    const bond = o.bond;
    const listing = o.listing;

    const proposedTotalAmountNu = Number(o.proposed_total_amount) / 10; // if toTenths() used BTN tenths

    const direction: "sent" | "received" =
      currentUserId && o.buyer_user_id === currentUserId
        ? "sent"
        : "received";

    return {
      id: o.id,

      bondId: o.bond_id,
      bondName: bond.bond_name,
      bondSymbol: bond.bond_symbol,

      listingId: o.listing_id,
      listingStatus: listing.status,

      buyerUserId: o.buyer_user_id,
      sellerUserId: o.seller_user_id,

      buyerWallet: o.buyer_wallet,
      sellerWallet: o.seller_wallet,

      units: o.units,
      unitsTenths: Number(o.units_tenths),

      originalInterestRate: o.original_interest_rate,
      proposedInterestRate: o.proposed_interest_rate,
      proposedTotalAmountNu,

      status: o.status,
      note: o.note ?? null,

      createdAt: o.created_at.toISOString(),
      updatedAt: o.updated_at.toISOString(),

      direction,
    };
  });
}


export async function getNegotiationDashboardData(userId: string) {
  const offers = await fetchNegotiationOffersForUser(userId);
  return offers;
}
