// app/api/investor/negotiations/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { settleNegotiationOnChain } from "@/server/blockchain/bond";
import { db } from "@/server/db";
import {
  updateNegotiationStatusForUser,
  getNegotiationOfferById,
} from "@/server/lib/negotiations";
import { acceptNegotiationOfferAndBuy } from "@/server/blockchain/bond";

export async function POST(req: NextRequest) {
  try {
    const { offerId, userId, action } = await req.json();

    if (!offerId || !userId || !action) {
      return NextResponse.json(
        { error: "offerId, userId and action are required" },
        { status: 400 }
      );
    }

    // Load the offer so we know buyer / seller
    const offer = await db.negotiationOffers.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // --- 1) REJECT: purely off-chain status change -------------------------
    if (action === "reject") {
      // Only seller (or buyer if you want) can reject
      if (
        offer.seller_user_id !== userId &&
        offer.buyer_user_id !== userId
      ) {
        return NextResponse.json(
          { error: "Not authorized to reject this offer" },
          { status: 403 }
        );
      }

      const dto = await updateNegotiationStatusForUser({
        offerId,
        userId,
        action: "reject",
      });

      // Frontend expects a NegotiationOfferDTO object
      return NextResponse.json(dto);
    }

    // --- 2) ACCEPT: FULL ON-CHAIN SETTLEMENT + DB UPDATES ------------------
    if (action === "accept") {
      // Only the seller (the one who owns the bond being resold) can accept
      if (offer.seller_user_id !== userId) {
        return NextResponse.json(
          { error: "Only the seller can accept this offer" },
          { status: 403 }
        );
      }

      // Load the buyer so we can get their wallet & encrypted mnemonic
      const buyer = await db.users.findUnique({
        where: { id: offer.buyer_user_id },
      });

      if (!buyer) {
        return NextResponse.json(
          { error: "Buyer user not found" },
          { status: 404 }
        );
      }

      if (!buyer.wallet_address || !buyer.hashed_mnemonic) {
        return NextResponse.json(
          {
            error:
              "Buyer wallet or mnemonic missing. Cannot execute on-chain payment.",
          },
          { status: 500 }
        );
      }

      // 🔹 This function:
      //  - Runs the Sui transaction (settleNegotiationOnChain)
      //  - Updates listings, allocations, negotiationOffers (incl. tx_hash)
      //  - Cancels other pending offers on the same listing
      const chainRes = await acceptNegotiationOfferAndBuy({
        offerId,
        buyerUserId: buyer.id,
        buyerAddress: buyer.wallet_address,
        buyerMnemonic: buyer.hashed_mnemonic, // encrypted mnemonic
      });

      // Off-chain DTO for frontend (maps DB row -> NegotiationOfferDTO)
      const dto = await updateNegotiationStatusForUser({
        offerId,
        userId,
        action: "accept",
      });

      // Include txDigest in the response for logging/UI if you want to use it later
      // Frontend currently ignores this extra field, which is fine.
      const responsePayload = {
        ...dto,
        txDigest: chainRes.digest,
      };

      return NextResponse.json(responsePayload);
    }

    // --- 3) Unsupported actions (e.g. "counter" not yet implemented server-side)
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (e) {
    console.error("negotiations/status error", e);
    return NextResponse.json(
      { error: "Internal server error", details: String(e) },
      { status: 500 }
    );
  }
}