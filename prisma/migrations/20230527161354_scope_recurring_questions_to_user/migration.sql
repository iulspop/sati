/*
  Warnings:

  - Added the required column `userId` to the `RecurringQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecurringQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "utcOffsetInMinutes" INTEGER NOT NULL,
    CONSTRAINT "RecurringQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecurringQuestion" ("id", "order", "question", "timestamp", "utcOffsetInMinutes") SELECT "id", "order", "question", "timestamp", "utcOffsetInMinutes" FROM "RecurringQuestion";
DROP TABLE "RecurringQuestion";
ALTER TABLE "new_RecurringQuestion" RENAME TO "RecurringQuestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
