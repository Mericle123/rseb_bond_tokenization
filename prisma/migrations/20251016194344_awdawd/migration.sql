/*
  Warnings:

  - Added the required column `tl_unit_offered` to the `Bonds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bonds" ADD COLUMN     "tl_unit_offered" INTEGER NOT NULL;
