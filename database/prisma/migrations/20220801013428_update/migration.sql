-- CreateTable
CREATE TABLE "eventNotifications" (
    "id" SERIAL NOT NULL,
    "messageTime" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "eventNotifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "eventNotifications" ADD CONSTRAINT "eventNotifications_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
