/*
  Warnings:

  - You are about to drop the column `price` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `customerEmail` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhoneNumber` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptUrl` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeChargeId` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSessionId` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketQuantity` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `used` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "price",
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhoneNumber" TEXT NOT NULL,
ADD COLUMN     "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "receiptUrl" TEXT NOT NULL,
ADD COLUMN     "stripeChargeId" TEXT NOT NULL,
ADD COLUMN     "stripeSessionId" TEXT NOT NULL,
ADD COLUMN     "ticketQuantity" INTEGER NOT NULL,
ADD COLUMN     "used" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
