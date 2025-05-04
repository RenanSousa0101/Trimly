/*
  Warnings:

  - You are about to alter the column `cnpj` on the `Provider` table. The data in that column could be lost. The data in that column will be cast from `VarChar(18)` to `VarChar(14)`.
  - You are about to alter the column `cpf` on the `Provider` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11);
