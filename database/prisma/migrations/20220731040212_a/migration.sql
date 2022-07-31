/*
  Warnings:

  - You are about to drop the column `owner_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_id` on the `user_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_tickets` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketId` to the `user_tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user_tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tickets" DROP CONSTRAINT "user_tickets_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tickets" DROP CONSTRAINT "user_tickets_user_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "owner_id",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'Unnamed Event';

-- AlterTable
ALTER TABLE "user_tickets" DROP COLUMN "ticket_id",
DROP COLUMN "user_id",
ADD COLUMN     "ticketId" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tickets" ADD CONSTRAINT "user_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tickets" ADD CONSTRAINT "user_tickets_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
