/*
  Warnings:

  - You are about to drop the `Dreams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dreams";

-- CreateTable
CREATE TABLE "Dream" (
    "id" TEXT NOT NULL,
    "dream" TEXT NOT NULL,
    "interpretationByFreud" TEXT NOT NULL,
    "interpretationByJung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DreamTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DreamTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_DreamTags_B_index" ON "_DreamTags"("B");

-- AddForeignKey
ALTER TABLE "_DreamTags" ADD CONSTRAINT "_DreamTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Dream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DreamTags" ADD CONSTRAINT "_DreamTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
