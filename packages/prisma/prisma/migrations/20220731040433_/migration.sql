/*
  Warnings:

  - You are about to drop the column `event_id` on the `tickets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tickets_event_id_key";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "event_id",
ADD COLUMN     "eventId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tickets_eventId_key" ON "tickets"("eventId");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
