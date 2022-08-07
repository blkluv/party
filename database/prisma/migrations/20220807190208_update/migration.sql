/*
  Warnings:

  - You are about to drop the column `ownerId` on the `events` table. All the data in the column will be lost.
  - Added the required column `hostId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "eventNotifications" DROP CONSTRAINT "eventNotifications_eventId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_eventId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "ownerId",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "hosts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Unnamed Host',
    "description" TEXT,

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostRoles" (
    "hostId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "hostRoles_pkey" PRIMARY KEY ("hostId","userId")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventNotifications" ADD CONSTRAINT "eventNotifications_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostRoles" ADD CONSTRAINT "hostRoles_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostRoles" ADD CONSTRAINT "hostRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
