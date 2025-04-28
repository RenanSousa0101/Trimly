/*
  Warnings:

  - A unique constraint covering the columns `[user_id,roles_id]` on the table `User_Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_Roles_user_id_roles_id_key" ON "User_Roles"("user_id", "roles_id");
