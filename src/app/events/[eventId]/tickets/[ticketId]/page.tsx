import { auth, clerkClient } from "@clerk/nextjs";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { and, eq } from "drizzle-orm";
import { InstagramIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import QRCode from "react-qr-code";
import { ClientDate } from "~/app/_components/ClientDate";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { Button } from "~/app/_components/ui/button";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import {
  isDiscussionEnabled,
  isLocationVisible,
} from "~/utils/event-time-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { createTicketFunText } from "~/utils/getTicketFunText";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { refreshTicketStatus } from "~/utils/refreshTicketStatus";
import { cn } from "~/utils/shadcn-ui";
import { LocationDialog, TicketInfoButton } from "./ticket-helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Ticket"),
};

const Page = async (props: {
  params: { ticketId: string; eventId: string };
}) => {
  return (
    <div className="flex justify-center flex-col items-center flex-1 p-2">
      <div className="relative flex flex-col items-stretch gap-4 ">
        <div className="w-48 h-48 z-0 bg-green-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
        <div className="w-48 h-48 z-0 bg-red-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[25%%] -translate-y-1/2" />
        <div className="w-48 h-48 z-0 bg-blue-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[75%] -translate-y-1/2" />
        <Suspense fallback={<LoadingSpinner size={55} />}>
          <TicketView
            eventId={props.params.eventId}
            ticketId={props.params.ticketId}
          />
        </Suspense>
      </div>
    </div>
  );
};

const _FunText = async (props: { eventId: string; ticketId: string }) => {
  const userAuth = auth();
  const text = await createTicketFunText({
    eventId: props.eventId,
    userId: userAuth.userId,
  });

  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

const TicketView = async (props: { eventId: string; ticketId: string }) => {
  const db = getDb();

  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const eventRole = await getUserEventRole(props.eventId);
  const isAdmin = eventRole === "admin";

  const ticketData = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.id, props.ticketId),
      // If the user is an admin, they are always allowed to view tickets
      // If not, the user needs to own the ticket
      isAdmin ? undefined : eq(tickets.userId, userAuth.userId)
    ),
    columns: {
      quantity: true,
      status: true,
      stripeSessionId: true,
      id: true,
      eventId: true,
      userId: true,
    },
    with: {
      price: {
        columns: {
          isFree: true,
        },
      },
      event: {
        columns: {
          id: true,
          name: true,
          startTime: true,
          location: true,
          hideLocation: true,
          type: true,
        },
      },
    },
  });

  if (!ticketData) {
    redirect(`/events/${props.eventId}`);
  }

  const user = await clerkClient.users.getUser(ticketData.userId);

  // Update status of ticket if pending
  const refreshedTicketData = await refreshTicketStatus(ticketData);
  if (refreshedTicketData) {
    ticketData.quantity = refreshedTicketData.quantity;
    ticketData.status = refreshedTicketData.status;
  }

  // Still not success, go back to event page
  if (ticketData.status !== "success") {
    redirect(`/events/${ticketData.event.id}`);
  }

  const showLocation = isLocationVisible(
    ticketData.event.startTime,
    ticketData.event.hideLocation
  );

  const showChat = isDiscussionEnabled({
    startTime: ticketData.event.startTime,
    type: ticketData.event.type,
    isTicketFound: true,
    role: eventRole,
  });

  return (
    <>
      <div className="border rounded-lg bg-neutral-900/50 relative z-10 px-8 py-8 flex flex-col gap-4">
        {/* <Suspense>
          <FunText eventId={props.eventId} ticketId={props.ticketId} />
        </Suspense> */}
        <div>
          <p className="text-sm text-center font-medium">
            {ticketData.event.name}
          </p>
          <p className="text-sm text-center font-medium text-gray-300">
            <ClientDate
              date={ticketData.event.startTime}
              format="D/M/YYYY [at] hh:mm a"
            />
          </p>
        </div>
        <QRCode
          value={`${env.NEXT_PUBLIC_WEBSITE_URL}/events/${ticketData.event.id}/tickets/${ticketData.id}/scan`}
          className="shadow-md border border-gray-300"
        />
        <h1 className="font-bold text-center text-lg capitalize">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-center font-medium">
          {`${ticketData.quantity} ticket${ticketData.quantity > 1 ? "s" : ""}`}
        </p>
        <div className="flex flex-col gap-2 border-t border-neutral-800">
          {showLocation && (
            <LocationDialog location={ticketData.event.location} />
          )}
          <div
            className={cn(
              "grid gap-2",
              showChat ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            <TicketInfoButton />
            {showChat && (
              <Link
                href={`/events/${props.eventId}/chat`}
                className="flex-1 block"
              >
                <Button variant="ghost" className="w-full">
                  <ChatBubbleBottomCenterTextIcon className="mr-2 w-4 h-4" />
                  <p>Chat</p>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="border rounded-lg bg-neutral-900/50 relative z-10 p-4 flex flex-col gap-4">
        <a
          className="flex items-center gap-2 justify-center hover:text-gray-300 transition"
          href="https://www.instagram.com/spidr_community/"
          target="_blank"
        >
          <div className="w-5 h-5 rounded flex items-center justify-center instagram">
            <InstagramIcon size={16} />
          </div>
          <p className="text-sm">Follow Us on Instagram</p>
        </a>
      </div>
    </>
  );
};

export default Page;
