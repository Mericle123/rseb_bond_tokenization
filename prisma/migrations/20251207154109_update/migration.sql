-- CreateEnum
CREATE TYPE "NegotiationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "NegotiationOffers" (
    "id" TEXT NOT NULL,
    "bond_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "buyer_user_id" TEXT NOT NULL,
    "seller_user_id" TEXT NOT NULL,
    "buyer_wallet" TEXT NOT NULL,
    "seller_wallet" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "units_tenths" BIGINT NOT NULL,
    "original_interest_rate" DOUBLE PRECISION NOT NULL,
    "proposed_interest_rate" DOUBLE PRECISION NOT NULL,
    "proposed_total_amount" BIGINT NOT NULL,
    "status" "NegotiationStatus" NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "tx_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NegotiationOffers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NegotiationOffers" ADD CONSTRAINT "NegotiationOffers_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegotiationOffers" ADD CONSTRAINT "NegotiationOffers_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegotiationOffers" ADD CONSTRAINT "NegotiationOffers_buyer_user_id_fkey" FOREIGN KEY ("buyer_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegotiationOffers" ADD CONSTRAINT "NegotiationOffers_seller_user_id_fkey" FOREIGN KEY ("seller_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
