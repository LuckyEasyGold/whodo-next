/*
  Warnings:

  - You are about to drop the column `public` on the `postagens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "postagens" DROP COLUMN "public",
ADD COLUMN     "publico" BOOLEAN NOT NULL DEFAULT true;
