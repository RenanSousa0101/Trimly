/*
  Warnings:

  - You are about to alter the column `phone_number` on the `Phone` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(16)`.

*/
-- AlterTable
ALTER TABLE "Phone" ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(16);
