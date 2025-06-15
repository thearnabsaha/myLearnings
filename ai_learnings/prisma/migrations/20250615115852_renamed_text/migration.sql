/*
  Warnings:

  - You are about to drop the column `text` on the `Dream` table. All the data in the column will be lost.
  - Added the required column `dream` to the `Dream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dream" DROP COLUMN "text",
ADD COLUMN     "dream" TEXT NOT NULL;
