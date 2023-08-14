import { auth } from "@clerk/nextjs";
import {
  ChatBubbleBottomCenterTextIcon,
  ExclamationCircleIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { and, asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { EventAdminToolbar } from "~/app/_components/EventAdminToolbar";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { Button } from "~/app/_components/ui/button";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { eventMedia, events, ticketPrices, tickets } from "~/db/schema";
import { isChatVisible } from "~/utils/event-time-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { getSoldTickets } from "~/utils/getSoldTickets";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { TicketTierListing } from "./TicketTierListing";
import { LocationDialog } from "./tickets/[ticketId]/ticket-helpers";

export const dynamic = "force-dynamic";
type PageProps = { params: { eventId: string } };

const getEventData = cache(async (id: string) => {
  const db = getDb();
  return await db.query.events.findFirst({
    columns: {
      description: true,
      name: true,
      startTime: true,
      id: true,
      userId: true,
      capacity: true,
      location: true,
    },
    with: {
      eventMedia: {
        columns: {
          id: true,
          isPoster: true,
          order: true,
          url: true,
        },
        orderBy: asc(eventMedia.order),
      },
      ticketPrices: {
        columns: {
          isFree: true,
          name: true,
          price: true,
          id: true,
        },
        orderBy: asc(ticketPrices.price),
      },
    },
    where: eq(events.id, id),
  });
});

const getTicketTiers = cache(async (eventId: string) => {
  const db = getDb();
  const userAuth = auth();

  if (userAuth.userId) {
    const existingTicket = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.eventId, eventId),
        eq(tickets.userId, userAuth.userId),
        eq(tickets.status, "success")
      ),
      columns: {
        quantity: true,
        id: true,
      },
    });

    if (existingTicket) {
      return {
        foundTicket: existingTicket,
        ticketPrices: [],
      };
    }
  }

  const foundTicketPrices = await db.query.ticketPrices.findMany({
    where: eq(ticketPrices.eventId, eventId),
    columns: {
      isFree: true,
      name: true,
      price: true,
      id: true,
    },
    orderBy: asc(ticketPrices.price),
  });

  return {
    foundTicket: null,
    ticketPrices: foundTicketPrices,
  };
});

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const eventData = await getEventData(props.params.eventId);

  if (!eventData) {
    return {};
  }

  const poster = eventData.eventMedia.find((e) => e.isPoster);

  const images: NonNullable<Metadata["openGraph"]>["images"] = [];

  if (poster) {
    images.push({ url: poster.url, width: 1200, height: 630 });
  }

  return {
    title: getPageTitle(eventData.name),
    description: eventData.description,
    openGraph: {
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      images,
      title: getPageTitle(eventData.name),
      description: eventData.description,
    },
  };
};

const Page = async (props: PageProps) => {
  return (
    <div className="mx-auto w-full max-w-3xl p-2 flex flex-col gap-8">
      <Suspense
        fallback={<LoadingSpinner size={75} className="mt-24 mx-auto" />}
      >
        <EventView eventId={props.params.eventId} />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex justify-center flex-wrap items-center gap-2">
            {[...Array.from({ length: 3 })].map((_, i) => (
              <div
                key={`placeholder ticket tier ${i}`}
                className="border border-neutral-800 bg-neutral-800/25 shadow-lg rounded-xl w-56 h-56"
              />
            ))}
          </div>
        }
      >
        <TicketTiersView eventId={props.params.eventId} />
      </Suspense>
    </div>
  );
};

const EventView = async (props: { eventId: string }) => {
  const eventData = await getEventData(props.eventId);

  if (!eventData) {
    redirect("/");
  }

  return (
    <>
      <div className="relative h-96 w-full rounded-xl overflow-hidden">
        {/* Placeholder image */}
        <div className="bg-neutral-800/25 inset-0 absolute z-0" />
        <Image
          src={eventData.eventMedia.find((e) => e.isPoster)?.url ?? ""}
          width={1200}
          height={1200}
          alt=""
          className="w-full h-full object-cover relative z-10"
        />
      </div>
      <AdminToolbarView eventId={props.eventId} />
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl text-center">{eventData.name}</h1>
          <p className="text-sm text-center text-gray-200">
            <ClientDate date={eventData.startTime} />
          </p>
        </div>

        {eventData.description.length > 0 && (
          <p className="text-center">{eventData.description}</p>
        )}
      </div>
    </>
  );
};

const AdminToolbarView = async (props: { eventId: string }) => {
  const eventRole = await getUserEventRole(props.eventId);

  return (
    <div className="flex justify-center">
      <EventAdminToolbar eventId={props.eventId} role={eventRole} />
    </div>
  );
};

const TicketTiersView = async (props: { eventId: string }) => {
  const [eventData, foundTicketPrices, ticketsSold] = await Promise.all([
    getEventData(props.eventId),
    getTicketTiers(props.eventId),
    getSoldTickets(props.eventId),
  ]);

  const isAtCapacity = !eventData || ticketsSold >= eventData.capacity;

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      {/* Event is unhosted, just make sure that we can see chat */}
      {!isAtCapacity &&
        eventData?.capacity === 0 &&
        isChatVisible(eventData.startTime) &&
        foundTicketPrices.ticketPrices.length === 0 && (
          <>
            <LocationDialog location={eventData.location} variant="ghost" />
            <Link href={`/events/${props.eventId}/chat`}>
              <Button>
                <ChatBubbleBottomCenterTextIcon className="mr-2 h-4 w-4" />
                <p>Join Discussion</p>
              </Button>
            </Link>
          </>
        )}

      {/* Event is at capacity and user has not purchased a ticket */}
      {isAtCapacity && !foundTicketPrices.foundTicket && (
        <div className="px-4 py-2 text-black rounded-full bg-white flex gap-2 items-center justify-center">
          <ExclamationCircleIcon className="w-6 h-6" />
          <p className="text-center font-medium">Event is at capacity</p>
        </div>
      )}

      {/* No ticket, but have ticket prices. Show ticket prices */}
      {!isAtCapacity &&
        foundTicketPrices.foundTicket === null &&
        foundTicketPrices.ticketPrices.length > 0 && (
          <>
            <p className="text-gray-100 font-semibold text-lg text-center">
              Ticket Tiers
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {foundTicketPrices.ticketPrices.map((price) => (
                <TicketTierListing
                  key={`ticket price ${price.id}`}
                  eventId={props.eventId}
                  data={price}
                />
              ))}
            </div>
          </>
        )}

      {/* Found a ticket */}
      {foundTicketPrices.foundTicket && (
        <Link
          href={`/events/${props.eventId}/tickets/${foundTicketPrices.foundTicket.id}`}
        >
          <Button>
            <TicketIcon className="mr-2 h-4 w-4" />
            <p>{`My Ticket${
              foundTicketPrices.foundTicket.quantity > 1 ? "s" : ""
            }`}</p>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Page;
