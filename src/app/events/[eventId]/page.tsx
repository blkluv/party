import { auth } from "@clerk/nextjs";
import { ExclamationCircleIcon, TicketIcon } from "@heroicons/react/24/outline";
import { and, asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import { match } from "ts-pattern";
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
import { JoinDiscussionButton } from "./join-discussion-button";
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
      type: true,
      hideLocation: true,
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

  const currentTicketPrices: typeof foundTicketPrices = [];

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
        currentTicketPrices,
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
      limit: true,
      visibility: true,
      description: true,
    },
    orderBy: asc(ticketPrices.order),
  });

  const ticketsSold = await Promise.all(
    foundTicketPrices.map((price) => getSoldTickets(eventId, price.id))
  );

  const firstDefaultTicketPrice = foundTicketPrices.find(
    (price, i) => ticketsSold[i] < price.limit && price.visibility === "default"
  );

  // Only show one limited tier at a time
  if (firstDefaultTicketPrice) {
    currentTicketPrices.push(firstDefaultTicketPrice);
  }

  // Add the always visible tiers
  currentTicketPrices.push(
    ...foundTicketPrices.filter(
      (price, i) =>
        price.visibility === "always" && ticketsSold[i] < price.limit
    )
  );

  return {
    foundTicket: null,
    currentTicketPrices,
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
    <div className="mx-auto w-full max-w-7xl p-2 flex flex-col md:grid md:grid-cols-2 gap-8 flex-1">
      <Suspense>
        <EventPoster eventId={props.params.eventId} />
      </Suspense>
      <div className="flex flex-col gap-4 md:gap-8">
        <AdminToolbarView eventId={props.params.eventId} />
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
    </div>
  );
};

const EventPoster = async (props: { eventId: string }) => {
  const eventData = await getEventData(props.eventId);

  if (!eventData) {
    redirect("/");
  }

  return (
    <Image
      src={eventData.eventMedia.find((e) => e.isPoster)?.url ?? ""}
      width={1200}
      height={1200}
      alt=""
      className="rounded-xl max-h-[700px] md:max-h-[900px] w-auto mx-auto"
    />
  );
};

const EventView = async (props: { eventId: string }) => {
  const eventData = await getEventData(props.eventId);

  if (!eventData) {
    redirect("/");
  }

  return (
    <>
      <div className="space-y-2">
        <h1 className="font-bold text-2xl md:text-4xl text-center md:text-left">
          {eventData.name}
        </h1>
        <p className="text-sm text-center text-gray-200 md:text-left">
          <ClientDate date={eventData.startTime} />
        </p>
      </div>

      {eventData.description.length > 0 && (
        <p className="text-center md:text-left">{eventData.description}</p>
      )}
    </>
  );
};

const AdminToolbarView = async (props: { eventId: string }) => {
  const eventRole = await getUserEventRole(props.eventId);

  if (eventRole === null) {
    return null;
  }

  return (
    <div className="flex justify-center md:justify-start">
      <EventAdminToolbar eventId={props.eventId} role={eventRole} />
    </div>
  );
};

const TicketTiersView = async (props: { eventId: string }) => {
  const [eventData, { foundTicket, currentTicketPrices }, ticketsSold] =
    await Promise.all([
      getEventData(props.eventId),
      getTicketTiers(props.eventId),
      getSoldTickets(props.eventId),
    ]);

  const userAuth = auth();

  const isAtCapacity = !eventData || ticketsSold >= eventData.capacity;

  // We show location if the location isn't hidden and the event is of type "event"
  // Or if the event type is "discussion" and the window to chat has not passed
  const showLocation = Boolean(
    eventData &&
      ((eventData.type === "event" && eventData.hideLocation === false) ||
        (eventData.type === "discussion" &&
          isChatVisible({
            startTime: eventData.startTime,
            eventType: eventData.type,
          })))
  );

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-start">
        <Suspense fallback={<LoadingSpinner className="mx-auto md:mx-0" />}>
          <DiscussionButtonWrapper eventId={props.eventId} />
        </Suspense>
        {/* Event is unhosted, just make sure that we can see chat */}
        {showLocation && eventData && (
          <LocationDialog location={eventData.location} variant="outline" />
        )}
      </div>
      {eventData?.type === "event" && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-start">
          {/* Event is at capacity and user has not purchased a ticket */}
          {isAtCapacity && !foundTicket && (
            <div className="px-4 py-2 text-black rounded-full bg-white flex gap-2 items-center justify-center">
              <ExclamationCircleIcon className="w-6 h-6" />
              <p className="text-center font-medium text-sm">
                Event is at capacity
              </p>
            </div>
          )}

          {/* No ticket, but have ticket prices. Show ticket prices */}
          {!isAtCapacity &&
            foundTicket === null &&
            currentTicketPrices.length > 0 && (
              <div className="flex justify-center flex-wrap gap-2">
                {currentTicketPrices.map((price) => (
                  <TicketTierListing
                    eventId={props.eventId}
                    data={price}
                    key={price.id}
                    disabled={userAuth?.userId === eventData.userId}
                  />
                ))}
              </div>
            )}

          {/* Found a ticket */}
          {foundTicket && (
            <Link href={`/events/${props.eventId}/tickets/${foundTicket.id}`}>
              <Button>
                <TicketIcon className="mr-2 h-4 w-4" />
                <p>{`My Ticket${foundTicket.quantity > 1 ? "s" : ""}`}</p>
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

const DiscussionButtonWrapper = async (props: { eventId: string }) => {
  const [eventData, { foundTicket }, eventRole] = await Promise.all([
    getEventData(props.eventId),
    getTicketTiers(props.eventId),
    getUserEventRole(props.eventId),
  ]);
  const isDiscussionEnabled = Boolean(
    eventData &&
      match(eventData.type)
        .with("discussion", () =>
          isChatVisible({
            startTime: eventData.startTime,
            eventType: eventData.type,
          })
        )
        .with(
          "event",
          () =>
            isChatVisible({
              startTime: eventData.startTime,
              eventType: eventData.type,
            }) &&
            (foundTicket !== null || eventRole === "admin")
        )
        .run()
  );
  return (
    <JoinDiscussionButton
      eventId={props.eventId}
      disabled={!isDiscussionEnabled}
    />
  );
};

export default Page;
