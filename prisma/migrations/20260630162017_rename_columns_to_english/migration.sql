/*
  Warnings:

  - You are about to drop the column `diskon` on the `detail_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `kembalian` on the `detail_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `metodeBayar` on the `detail_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `nominalPembayaran` on the `detail_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `totalModal` on the `detail_transactions` table. All the data in the column will be lost.
  - Added the required column `changeAmount` to the `detail_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentAmount` to the `detail_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `detail_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCapital` to the `detail_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detail_transactions" DROP COLUMN "diskon",
DROP COLUMN "kembalian",
DROP COLUMN "metodeBayar",
DROP COLUMN "nominalPembayaran",
DROP COLUMN "totalModal",
ADD COLUMN     "changeAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paymentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "totalCapital" DOUBLE PRECISION NOT NULL;
