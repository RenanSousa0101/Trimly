/*
  Warnings:

  - A unique constraint covering the columns `[role_type]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_type_key" ON "Roles"("role_type");
