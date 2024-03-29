-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "RecurringQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "utcOffsetInMinutes" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "response" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "RecurringQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Slo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "denominatorLabel" TEXT NOT NULL,
    "denominator" INTEGER NOT NULL,
    "targetPercentage" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "sloId" TEXT NOT NULL,
    CONSTRAINT "Stream_sloId_fkey" FOREIGN KEY ("sloId") REFERENCES "Slo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "streamId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "Event_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_sloId_key" ON "Stream"("sloId");
