-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "sloId" TEXT NOT NULL,
    CONSTRAINT "Stream_sloId_fkey" FOREIGN KEY ("sloId") REFERENCES "Slo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Stream" ("createdAt", "id", "sloId", "source") SELECT "createdAt", "id", "sloId", "source" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
