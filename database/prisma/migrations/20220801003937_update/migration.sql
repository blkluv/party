/*
  Warnings:

  - You are about to drop the column `title` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unnamed Event';
