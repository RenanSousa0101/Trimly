/*
  Warnings:

  - A unique constraint covering the columns `[phone_id]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address_id]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_id` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "phone_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Provider_phone_id_key" ON "Provider"("phone_id");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_address_id_key" ON "Provider"("address_id");
