-- CreateTable
CREATE TABLE "SLO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "denominatorLabel" TEXT NOT NULL,
    "denominator" INTEGER NOT NULL,
    "targetPercentage" REAL NOT NULL,
    "interpreter" TEXT NOT NULL
);
