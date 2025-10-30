/*
  Warnings:

  - Changed the type of `subscription_period` on the `Bonds` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Bonds" DROP COLUMN "subscription_period",
ADD COLUMN     "subscription_period" INTEGER NOT NULL;
