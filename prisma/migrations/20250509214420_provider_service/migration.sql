/*
  Warnings:

  - You are about to alter the column `price` on the `Provider_Service` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Provider_Service" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);
