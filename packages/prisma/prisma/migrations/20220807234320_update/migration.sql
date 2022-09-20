/*
  Warnings:

  - You are about to drop the `userTickets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `hosts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userTickets" DROP CONSTRAINT "userTickets_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "userTickets" DROP CONSTRAINT "userTickets_userId_fkey";

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT DEFAULT 'https://www.gravatar.com/avatar/00000000000000000000000000000000';

-- DropTable
DROP TABLE "userTickets";

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
