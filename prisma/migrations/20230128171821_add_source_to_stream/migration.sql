/*
  Warnings:

  - Added the required column `source` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sloId" TEXT NOT NULL,
    CONSTRAINT "Stream_sloId_fkey" FOREIGN KEY ("sloId") REFERENCES "Slo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stream" ("createdAt", "id", "name", "sloId") SELECT "createdAt", "id", "name", "sloId" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
