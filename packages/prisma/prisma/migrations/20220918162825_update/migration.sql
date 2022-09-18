/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "customerEmail" DROP NOT NULL,
ALTER COLUMN "receiptUrl" DROP NOT NULL,
ALTER COLUMN "stripeChargeId" DROP NOT NULL,
ALTER COLUMN "stripeSessionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tickets_slug_key" ON "tickets"("slug");
