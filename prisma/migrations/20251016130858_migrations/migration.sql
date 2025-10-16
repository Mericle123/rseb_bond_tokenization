-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('subscription', 'transfer', 'maturity');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "national_id" BIGINT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL,
    "hashed_mnemonic" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bonds" (
    "id" TEXT NOT NULL,
    "bond_object_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "face_value" BIGINT NOT NULL,
    "price" BIGINT NOT NULL,
    "maturity" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "interest_rate" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "committed_amount" BIGINT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "bond_id" TEXT NOT NULL,
    "user_from" TEXT NOT NULL,
    "user_to" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_national_id_key" ON "Users"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_wallet_address_key" ON "Users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
