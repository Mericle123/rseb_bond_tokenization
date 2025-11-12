-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ALTER COLUMN "wallet_address" DROP NOT NULL;
