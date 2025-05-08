/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,specialization_id]` on the table `Provider_Specialization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Provider_Specialization_provider_id_specialization_id_key" ON "Provider_Specialization"("provider_id", "specialization_id");
