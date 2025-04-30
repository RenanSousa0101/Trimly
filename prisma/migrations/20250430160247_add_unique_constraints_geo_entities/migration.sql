/*
  Warnings:

  - A unique constraint covering the columns `[name,state_id]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[acronym]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,city_id]` on the table `District` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uf,country_id]` on the table `State` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "City_name_state_id_key" ON "City"("name", "state_id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_acronym_key" ON "Country"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_city_id_key" ON "District"("name", "city_id");

-- CreateIndex
CREATE UNIQUE INDEX "State_uf_country_id_key" ON "State"("uf", "country_id");
