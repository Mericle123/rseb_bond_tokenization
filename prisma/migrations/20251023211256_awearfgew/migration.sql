/*
  Warnings:

  - Added the required column `subscription_end_date` to the `Bonds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bonds" ADD COLUMN     "subscription_end_date" TIMESTAMP(3) NOT NULL;
