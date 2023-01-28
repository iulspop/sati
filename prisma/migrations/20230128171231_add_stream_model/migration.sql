-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "sloId" TEXT NOT NULL,
    CONSTRAINT "Stream_sloId_fkey" FOREIGN KEY ("sloId") REFERENCES "Slo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
