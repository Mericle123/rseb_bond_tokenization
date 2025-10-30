-- CreateEnum
CREATE TYPE "Market" AS ENUM ('current', 'resale');

-- AlterTable
ALTER TABLE "Bonds" ADD COLUMN     "market" "Market";
