PRAGMA foreign_keys=OFF;
ALTER TABLE "RecurringQuestion" RENAME COLUMN "question" TO "text";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
