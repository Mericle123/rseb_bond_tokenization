-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('pending', 'verified', 'rejected', 'error');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "kyc_status" "KYCStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "EKYCVerifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "national_id_hash" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "custodial_address" TEXT NOT NULL,
    "tx_digest" TEXT,
    "status" "KYCStatus" NOT NULL DEFAULT 'pending',
    "reason" TEXT,
    "request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EKYCVerifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EKYCVerifications" ADD CONSTRAINT "EKYCVerifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
