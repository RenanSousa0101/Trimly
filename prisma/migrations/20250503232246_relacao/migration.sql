/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Provider_user_id_key" ON "Provider"("user_id");
