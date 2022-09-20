-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ticketPriceId" INTEGER;

-- CreateTable
CREATE TABLE "ticketPrices" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "free" BOOLEAN DEFAULT false,
    "paymentLink" TEXT,
    "paymentLinkId" TEXT,

    CONSTRAINT "ticketPrices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticketPriceId_fkey" FOREIGN KEY ("ticketPriceId") REFERENCES "ticketPrices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketPrices" ADD CONSTRAINT "ticketPrices_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
