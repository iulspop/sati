/*
  Warnings:

  - You are about to drop the column `interpreter` on the `Slo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Slo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "denominatorLabel" TEXT NOT NULL,
    "denominator" INTEGER NOT NULL,
    "targetPercentage" REAL NOT NULL
);
INSERT INTO "new_Slo" ("createdAt", "denominator", "denominatorLabel", "id", "name", "targetPercentage") SELECT "createdAt", "denominator", "denominatorLabel", "id", "name", "targetPercentage" FROM "Slo";
DROP TABLE "Slo";
ALTER TABLE "new_Slo" RENAME TO "Slo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
