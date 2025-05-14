/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,service_id]` on the table `Provider_Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Provider_Service_provider_id_service_id_key" ON "Provider_Service"("provider_id", "service_id");
