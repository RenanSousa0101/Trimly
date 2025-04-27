/*
  Warnings:

  - You are about to drop the column `Phone_type` on the `Phone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Phone" DROP COLUMN "Phone_type",
ADD COLUMN     "phone_type" "PhoneType" NOT NULL DEFAULT 'Mobile';
