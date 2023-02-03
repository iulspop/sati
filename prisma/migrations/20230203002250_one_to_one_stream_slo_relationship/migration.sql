/*
  Warnings:

  - A unique constraint covering the columns `[sloId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stream_sloId_key" ON "Stream"("sloId");
