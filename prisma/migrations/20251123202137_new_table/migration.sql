-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('open', 'filled', 'cancelled');

-- CreateTable
CREATE TABLE "Listings" (
    "id" TEXT NOT NULL,
    "bond_id" TEXT NOT NULL,
    "seller_user_id" TEXT NOT NULL,
    "seller_wallet" TEXT NOT NULL,
    "listing_onchain" INTEGER NOT NULL,
    "amount_tenths" BIGINT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'open',
    "tx_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_seller_user_id_fkey" FOREIGN KEY ("seller_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
