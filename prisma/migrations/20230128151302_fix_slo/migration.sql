/*
  Warnings:

  - You are about to drop the `SLO` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SLO";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Slo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "denominatorLabel" TEXT NOT NULL,
    "denominator" INTEGER NOT NULL,
    "targetPercentage" REAL NOT NULL,
    "interpreter" TEXT NOT NULL
);
