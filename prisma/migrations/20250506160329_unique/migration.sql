/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Provider_cnpj_key" ON "Provider"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_cpf_key" ON "Provider"("cpf");
