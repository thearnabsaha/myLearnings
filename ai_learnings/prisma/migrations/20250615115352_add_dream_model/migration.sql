-- CreateTable
CREATE TABLE "Dream" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "interpretation" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);
