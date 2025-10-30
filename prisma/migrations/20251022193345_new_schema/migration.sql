/*
  Warnings:

  - Added the required column `wallet_address` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "wallet_address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_bond_id_fkey" FOREIGN KEY ("bond_id") REFERENCES "Bonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_from_fkey" FOREIGN KEY ("user_from") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_to_fkey" FOREIGN KEY ("user_to") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
