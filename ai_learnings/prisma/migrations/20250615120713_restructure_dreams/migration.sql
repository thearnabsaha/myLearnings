/*
  Warnings:

  - You are about to drop the `Dream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dream";

-- CreateTable
CREATE TABLE "Dreams" (
    "id" TEXT NOT NULL,
    "dream" TEXT NOT NULL,
    "interpretationByFreud" TEXT NOT NULL,
    "interpretationByJung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dreams_pkey" PRIMARY KEY ("id")
);
