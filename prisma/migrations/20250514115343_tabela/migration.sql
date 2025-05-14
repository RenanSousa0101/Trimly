/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address_id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "date_of_birth",
ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "communication_preference" VARCHAR(255),
ADD COLUMN     "cpf" VARCHAR(11) NOT NULL,
ADD COLUMN     "phone_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_id_key" ON "Client"("phone_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_address_id_key" ON "Client"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");
