// app/api/investor/negotiations/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createNegotiationOfferForListing } from "@/server/lib/negotiations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      bondId,
      listingId,
      buyerUserId,
      buyerWallet,
      sellerUserId,
      sellerWallet,
      units,
      originalInterestRate,
      proposedInterestRate,
      proposedTotalAmountNu,
      note,
    } = body;

    if (!buyerUserId) {
      return NextResponse.json(
        { error: "buyerUserId is required" },
        { status: 400 }
      );
    }

    if (!bondId || !listingId) {
      return NextResponse.json(
        { error: "bondId and listingId are required" },
        { status: 400 }
      );
    }

    const offer = await createNegotiationOfferForListing({
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
    });

    return NextResponse.json({ offer });
  } catch (err) {
    console.error("Error creating negotiation offer:", err);
    return NextResponse.json(
      { error: "Failed to create negotiation offer" },
      { status: 500 }
    );
  }
}
