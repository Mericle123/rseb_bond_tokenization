-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('subscription', 'transfer', 'maturity');

-- CreateEnum
CREATE TYPE "BondType" AS ENUM ('government_Bond', 'corporate_Bond', 'green_Bond', 'development_Bond', 'domestic_Bond');

-- CreateEnum
CREATE TYPE "Market" AS ENUM ('current', 'resale');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('pending', 'verified', 'rejected', 'error');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('open', 'filled', 'cancelled');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "national_id" BIGINT NOT NULL,
    "wallet_address" TEXT,
    "salt" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "password" TEXT,
    "role" "Role" NOT NULL,
    "hashed_mnemonic" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kyc_status" "KYCStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EKYCVerifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "national_id_hash" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER,
    "custodial_address" TEXT NOT NULL,
    "tx_digest" TEXT,
    "status" "KYCStatus" NOT NULL DEFAULT 'pending',
    "reason" TEXT,
    "request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EKYCVerifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bonds" (
    "id" TEXT NOT NULL,
    "bond_object_id" TEXT,
    "bond_name" TEXT NOT NULL,
    "bond_type" "BondType" NOT NULL,
    "bond_symbol" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "face_value" BIGINT NOT NULL,
    "tl_unit_offered" INTEGER NOT NULL,
    "tl_unit_subscribed" INTEGER,
    "maturity" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "interest_rate" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "market" "Market",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscription_period" INTEGER NOT NULL,
    "subscription_end_date" TIMESTAMP(3) NOT NULL,
    "allocated" BOOLEAN,

    CONSTRAINT "Bonds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "bond_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "bond_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "committed_amount" BIGINT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "subscription_amt" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "user_from" TEXT NOT NULL,
    "user_to" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allocations" (
    "id" TEXT NOT NULL,
    "bond_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "allocated_tenths" BIGINT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Allocations_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Users_national_id_key" ON "Users"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_wallet_address_key" ON "Users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "EKYCVerifications" ADD CONSTRAINT "EKYCVerifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_from_fkey" FOREIGN KEY ("user_from") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_to_fkey" FOREIGN KEY ("user_to") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocations" ADD CONSTRAINT "Allocations_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocations" ADD CONSTRAINT "Allocations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_seller_user_id_fkey" FOREIGN KEY ("seller_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
