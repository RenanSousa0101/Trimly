/*
  Warnings:

  - You are about to drop the column `Description` on the `Specialization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Specialization" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;
