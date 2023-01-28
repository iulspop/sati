-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecurringQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "utcOffsetInMinutes" INTEGER NOT NULL
);
INSERT INTO "new_RecurringQuestion" ("id", "order", "question", "timestamp", "utcOffsetInMinutes") SELECT "id", "order", "question", "timestamp", "utcOffsetInMinutes" FROM "RecurringQuestion";
DROP TABLE "RecurringQuestion";
ALTER TABLE "new_RecurringQuestion" RENAME TO "RecurringQuestion";
CREATE TABLE "new_Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "response" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "RecurringQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("id", "questionId", "response", "timestamp") SELECT "id", "questionId", "response", "timestamp" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
