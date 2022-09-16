/*
  Warnings:

  - You are about to drop the `user_tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_tickets" DROP CONSTRAINT "user_tickets_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "user_tickets" DROP CONSTRAINT "user_tickets_userId_fkey";

-- DropTable
DROP TABLE "user_tickets";

-- CreateTable
CREATE TABLE "userTickets" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "userTickets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userTickets" ADD CONSTRAINT "userTickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTickets" ADD CONSTRAINT "userTickets_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
