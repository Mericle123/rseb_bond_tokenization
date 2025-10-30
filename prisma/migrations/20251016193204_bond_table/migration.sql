/*
  Warnings:

  - You are about to drop the column `name` on the `Bonds` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Bonds` table. All the data in the column will be lost.
  - Added the required column `bond_name` to the `Bonds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bond_symbol` to the `Bonds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bond_type` to the `Bonds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_name` to the `Bonds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Bonds` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BondType" AS ENUM ('government_Bond', 'corporate_Bond', 'green_Bond', 'development_Bond', 'domestic_Bond');

-- AlterTable
ALTER TABLE "Bonds" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "bond_name" TEXT NOT NULL,
ADD COLUMN     "bond_symbol" TEXT NOT NULL,
ADD COLUMN     "bond_type" "BondType" NOT NULL,
ADD COLUMN     "organization_name" TEXT NOT NULL,
ADD COLUMN     "purpose" TEXT NOT NULL,
ALTER COLUMN "bond_object_id" DROP NOT NULL;
