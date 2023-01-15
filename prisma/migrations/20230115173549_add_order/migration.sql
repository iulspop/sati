/*
  Warnings:

  - Added the required column `order` to the `RecurringQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecurringQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utcOffsetInMinutes" INTEGER NOT NULL
);
INSERT INTO "new_RecurringQuestion" ("id", "question", "timestamp", "utcOffsetInMinutes") SELECT "id", "question", "timestamp", "utcOffsetInMinutes" FROM "RecurringQuestion";
DROP TABLE "RecurringQuestion";
ALTER TABLE "new_RecurringQuestion" RENAME TO "RecurringQuestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
