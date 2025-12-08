"use server";

import { db } from "@/server/db";
import { NegotiationStatus } from "@prisma/client";

// BTNC has 1 decimal (tenths). Adjust if you ever change it.
const BTNC_DECIMALS = 1;
const BTNC_FACTOR = 10 ** BTNC_DECIMALS;

export type NegotiationOfferDTO = {
  id: string;

  bondId: string;
  bondName: string;
  bondSymbol: string | null;

  buyerWallet: string;
  sellerWallet: string;

  units: number;
  unitsTenths: number;

  originalInterestRate: number;
  proposedInterestRate: number;

  // total amount in BTN (Nu) as plain number for the UI
  proposedTotalAmountNu: number;

  status: "pending" | "accepted" | "rejected" | "cancelled";

  // from the point of view of `userId` passed into mapping
  direction: "sent" | "received";

  createdAt: string;
  updatedAt: string;
};

export type UserOffersSummary = {
  sent: NegotiationOfferDTO[];
  received: NegotiationOfferDTO[];
};

export async function fetchNegotiationOffersForUser(
  userId: string
): Promise<UserOffersSummary> {
  if (!userId) throw new Error("userId is required");

  // SENT: where this user is buyer
  const sentRaw = await db.negotiationOffers.findMany({
    where: { buyer_user_id: userId },
    include: {
      bond: true,
      listing: true,
      buyer: true,
      seller: true,
    },
    orderBy: { created_at: "desc" },
  });

  // RECEIVED: where this user is seller
  const receivedRaw = await db.negotiationOffers.findMany({
    where: { seller_user_id: userId },
    include: {
      bond: true,
      listing: true,
      buyer: true,
      seller: true,
    },
    orderBy: { created_at: "desc" },
  });

  const mapOffer = (
    o: any,
    direction: "sent" | "received"
  ): NegotiationOfferDTO => {
    const bond = o.bond;
    const listing = o.listing;
    const proposedTotalAmountNu = Number(o.proposed_total_amount) / 10;

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
  };

  return {
    sent: sentRaw.map((o) => mapOffer(o, "sent")),
    received: receivedRaw.map((o) => mapOffer(o, "received")),
  };
}


// -----------------------------
// Shared DTO type (matches page.tsx)
// -----------------------------
// export type NegotiationOfferDTO = {
//   id: string;

//   bondId: string;
//   bondName: string;
//   bondSymbol: string | null;

//   buyerWallet: string;
//   sellerWallet: string;

//   units: number;        // human units
//   unitsTenths: number;  // tenths on-chain

//   originalInterestRate: number; // e.g. 6.0
//   proposedInterestRate: number; // e.g. 5.8

//   proposedTotalAmountNu: number; // BTN in human units

//   status: "pending" | "accepted" | "rejected" | "cancelled";

//   // relative to CURRENT USER (set by caller)
//   direction: "sent" | "received";

//   createdAt: string; // ISO
//   updatedAt: string; // ISO
// };

// -----------------------------
// Helpers
// -----------------------------
function fromTenthsToNu(value: bigint | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "bigint" ? Number(value) : value;
  return num / BTNC_FACTOR;
}

function mapNegotiationOfferToDTO(
  offer: any,
  direction: "sent" | "received"
): NegotiationOfferDTO {
  return {
    id: offer.id,

    bondId: offer.bond_id,
    bondName: offer.bond?.bond_name ?? "",
    bondSymbol: offer.bond?.bond_symbol ?? null,

    buyerWallet: offer.buyer_wallet,
    sellerWallet: offer.seller_wallet,

    units: offer.units,
    unitsTenths: Number(offer.units_tenths ?? 0),

    originalInterestRate: offer.original_interest_rate ?? 0,
    proposedInterestRate: offer.proposed_interest_rate ?? 0,

    proposedTotalAmountNu: fromTenthsToNu(offer.proposed_total_amount),

    status: offer.status,

    direction,

    createdAt: offer.created_at.toISOString(),
    updatedAt: offer.updated_at.toISOString(),
  };
}

// -----------------------------
// MAIN DASHBOARD FETCHER
// -----------------------------
/**
 * Fetch all negotiation offers for a user, split into:
 *  - sent  -> user is the BUYER
 *  - received -> user is the SELLER
 */
// export async function getNegotiationDashboardData(userId: string): Promise<{
//   sent: NegotiationOfferDTO[];
//   received: NegotiationOfferDTO[];
// }> {
//   if (!userId) {
//     return { sent: [], received: [] };
//   }

//   const [sentRaw, receivedRaw] = await Promise.all([
//     db.negotiationOffers.findMany({
//       where: { buyer_user_id: userId },
//       include: {
//         bond: true,
//         listing: true,
//       },
//       orderBy: { created_at: "desc" },
//     }),
//     db.negotiationOffers.findMany({
//       where: { seller_user_id: userId },
//       include: {
//         bond: true,
//         listing: true,
//       },
//       orderBy: { created_at: "desc" },
//     }),
//   ]);

//   const sent = sentRaw.map((o) => mapNegotiationOfferToDTO(o, "sent"));
//   const received = receivedRaw.map((o) =>
//     mapNegotiationOfferToDTO(o, "received")
//   );

//   return { sent, received };
// }

// -----------------------------
// CREATE NEGOTIATION OFFER
// (called when buyer opens negotiation on a listing)
// -----------------------------
type CreateNegotiationOfferInput = {
  listingId: string;
  buyerUserId: string;

  // negotiation terms
  units: number;                 // human units
  proposedInterestRate: number;  // e.g. 5.8
  proposedTotalAmountNu: number; // BTN human amount (not tenths)

  note?: string;
};

export async function createNegotiationOffer(
  input: CreateNegotiationOfferInput
): Promise<NegotiationOfferDTO> {
  const { listingId, buyerUserId, units, proposedInterestRate, proposedTotalAmountNu, note } =
    input;

  // 1) Load listing + bond + seller
  const listing = await db.listings.findUnique({
    where: { id: listingId },
    include: {
      bond: true,
      seller: true,
    },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.status !== "open") {
    throw new Error("Listing is not open for negotiation");
  }

  // 2) Buyer user + wallet
  const buyer = await db.users.findUnique({
    where: { id: buyerUserId },
  });

  if (!buyer || !buyer.wallet_address) {
    throw new Error("Buyer wallet address not found");
  }

  // 3) Basic range checks (optional, but safer)
  if (units <= 0) throw new Error("Units must be positive");

  // For safety, don't allow negotiating more than listed
  const listedUnits = Number(listing.amount_tenths) / 10;
  if (units > listedUnits) {
    throw new Error("Requested units exceed listed amount");
  }

  // 4) Convert to tenths
  const unitsTenths = BigInt(Math.round(units * 10));
  const proposedTotalTenths = BigInt(
    Math.round(proposedTotalAmountNu * BTNC_FACTOR)
  );

  const originalRate = parseFloat(listing.bond.interest_rate || "0");

  // 5) Create NegotiationOffers row
  const created = await db.negotiationOffers.create({
    data: {
      bond_id: listing.bond_id,
      listing_id: listing.id,

      buyer_user_id: buyerUserId,
      seller_user_id: listing.seller_user_id,

      buyer_wallet: buyer.wallet_address,
      seller_wallet: listing.seller_wallet,

      units,
      units_tenths: unitsTenths,

      original_interest_rate: originalRate,
      proposed_interest_rate: proposedInterestRate,
      proposed_total_amount: proposedTotalTenths,

      status: NegotiationStatus.pending,
      note: note ?? null,
    },
    include: {
      bond: true,
      listing: true,
    },
  });

  return mapNegotiationOfferToDTO(created, "sent");
}

// -----------------------------
// UPDATE NEGOTIATION STATUS
// (accept / reject / cancel)
// -----------------------------
type UpdateNegotiationStatusInput = {
  offerId: string;
  userId: string; // current user
  action: "accept" | "reject" | "cancel";
};



/**
 * DTO shape that the API returns to the frontend
 * (matches what we used in page.tsx)
 */


/** Internal helper: map Prisma row → DTO */
function toNegotiationDto(
  row: any,
  currentUserId: string,
  directionHint?: "sent" | "received"
): NegotiationOfferDTO {
  const direction: "sent" | "received" =
    directionHint ??
    (row.buyer_user_id === currentUserId ? "sent" : "received");

  return {
    id: row.id,

    bondId: row.bond_id,
    bondName: row.bond?.bond_name ?? "",
    bondSymbol: row.bond?.bond_symbol ?? null,

    buyerWallet: row.buyer_wallet,
    sellerWallet: row.seller_wallet,

    units: row.units,
    unitsTenths: Number(row.units_tenths ?? 0),

    originalInterestRate: row.original_interest_rate,
    proposedInterestRate: row.proposed_interest_rate,

    proposedTotalAmountNu: Number(row.proposed_total_amount ?? 0),

    status: row.status as NegotiationOfferDTO["status"],
    direction,

    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/**
 * Dashboard data for a given user:
 * - sent: offers where user is buyer
 * - received: offers where user is seller
 */
export async function getNegotiationDashboardData(userId: string) {
  if (!userId) throw new Error("userId is required");

  const [sentRows, receivedRows] = await Promise.all([
    db.negotiationOffers.findMany({
      where: { buyer_user_id: userId },
      include: { bond: true },
      orderBy: { created_at: "desc" },
    }),
    db.negotiationOffers.findMany({
      where: { seller_user_id: userId },
      include: { bond: true },
      orderBy: { created_at: "desc" },
    }),
  ]);

  const sent: NegotiationOfferDTO[] = sentRows.map((row) =>
    toNegotiationDto(row, userId, "sent")
  );
  const received: NegotiationOfferDTO[] = receivedRows.map((row) =>
    toNegotiationDto(row, userId, "received")
  );

  return { sent, received };
}

/**
 * Create a new negotiation offer for a listing (Plan 2 – off-chain negotiation).
 * You can call this from resale listing page when the buyer clicks "Negotiate".
 */
export async function createNegotiationOfferForListing(params: {
  bondId: string;
  listingId: string;
  buyerUserId: string;
  sellerUserId: string;
  buyerWallet: string;
  sellerWallet: string;

  // human units (e.g. 1.5 units => 15 tenths)
  units: number;

  // percentages, e.g. 6.0, 5.8
  originalInterestRate: number;
  proposedInterestRate: number;

  // total amount in BTN (Nu) as plain number on backend (we’ll store as BigInt)
  proposedTotalAmountNu: number;

  note?: string;
}) {
  const {
    bondId,
    listingId,
    buyerUserId,
    sellerUserId,
    buyerWallet,
    sellerWallet,
    units,
    originalInterestRate,
    proposedInterestRate,
    proposedTotalAmountNu,
    note,
  } = params;

  // Convert to tenths (same convention as the rest of your system)
  const unitsTenths = BigInt(Math.round(units * 10));
  const totalAmount = BigInt(Math.round(proposedTotalAmountNu));

  const row = await db.negotiationOffers.create({
    data: {
      bond_id: bondId,
      listing_id: listingId,
      buyer_user_id: buyerUserId,
      seller_user_id: sellerUserId,
      buyer_wallet: buyerWallet,
      seller_wallet: sellerWallet,

      units,
      units_tenths: unitsTenths,

      original_interest_rate: originalInterestRate,
      proposed_interest_rate: proposedInterestRate,
      proposed_total_amount: totalAmount,

      status: "pending",
      note,
    },
    include: { bond: true },
  });

  return toNegotiationDto(row, buyerUserId, "sent");
}

/**
 * Accept / reject / cancel a negotiation offer.
 * This is *off-chain* status management only.
 */
export async function updateNegotiationStatusForUser(params: {
  offerId: string;
  userId: string;
  action: "accept" | "reject" | "cancel";
}): Promise<NegotiationOfferDTO> {
  const { offerId, userId, action } = params;

  const existing = await db.negotiationOffers.findUnique({
    where: { id: offerId },
  });

  if (!existing) {
    throw new Error("Negotiation offer not found");
  }

  // Only buyer or seller can update
  if (
    existing.buyer_user_id !== userId &&
    existing.seller_user_id !== userId
  ) {
    throw new Error("Not authorized to modify this offer");
  }

  let newStatus: NegotiationStatus;
  switch (action) {
    case "accept":
      newStatus = "accepted";
      break;
    case "reject":
      newStatus = "rejected";
      break;
    case "cancel":
    default:
      newStatus = "cancelled";
      break;
  }

  const updated = await db.negotiationOffers.update({
    where: { id: offerId },
    data: {
      status: newStatus,
    },
    include: { bond: true },
  });

  const direction: "sent" | "received" =
    updated.buyer_user_id === userId ? "sent" : "received";

  return toNegotiationDto(updated, userId, direction);
}


export async function getNegotiationOfferById(offerId: string) {
  return db.negotiationOffers.findUnique({
    where: { id: offerId },
  });
}
