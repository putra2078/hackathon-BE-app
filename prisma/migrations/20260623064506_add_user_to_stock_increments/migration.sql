/*
  Warnings:

  - Added the required column `userId` to the `stock_increments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_increments" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "stock_increments" ADD CONSTRAINT "stock_increments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
