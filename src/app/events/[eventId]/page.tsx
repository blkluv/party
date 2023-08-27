import { auth } from "@clerk/nextjs";
import {
  ChatBubbleBottomCenterTextIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { and, asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import { PromotionCodeExpiryNotification } from "~/app/_components/promotion-code-expiry";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import {
  eventMedia,
  events,
  promotionCodes,
  ticketPrices,
  tickets,
} from "~/db/schema";
import { isDiscussionEnabled } from "~/utils/event-time-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { getSoldTickets } from "~/utils/getSoldTickets";
import { getUserEventRole as getRoleFn } from "~/utils/getUserEventRole";
import {
  EventDescription,
  EventHeader,
  EventManagementDropdown,
  JoinDiscussionAlertDialog,
  TicketTiersDialog,
} from "./event-components";
import { MapView } from "./tickets/[ticketId]/ticket-helpers";

const getUserEventRole = cache(getRoleFn);

export const dynamic = "force-dynamic";
type PageProps = {
  params: { eventId: string };
  searchParams: { promotionCode?: string };
};

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
    <div className="flex flex-col pb-4 lg:flex-row lg:gap-4 lg:rounded-2xl lg:pb-0 lg:max-w-6xl lg:w-full lg:mx-auto lg:my-8">
      <Suspense>
        <EventHeaderView eventId={props.params.eventId} />
      </Suspense>
      <div className="lg:w-2/3 flex flex-col">
        <EventBodyView eventId={props.params.eventId} />
        <TicketTiersView eventId={props.params.eventId} />
      </div>
      {props.searchParams.promotionCode && (
        <PromotionCodeExpiryView
          eventId={props.params.eventId}
          promotionCode={props.searchParams.promotionCode}
        />
      )}
    </div>
  );
};

const EventBodyView = async (props: { eventId: string }) => {
  const [eventData, eventRole] = await Promise.all([
    getEventData(props.eventId),
    getUserEventRole(props.eventId),
  ]);

  if (!eventData) {
    redirect("/");
  }

  // We show location if the location isn't hidden and the event is of type "event"
  // Or if the event type is "discussion" and the window to chat has not passed
  const showLocation = Boolean(
    eventData &&
      ((eventData.type === "event" && eventData.hideLocation === false) ||
        (eventData.type === "discussion" &&
          isDiscussionEnabled({
            startTime: eventData.startTime,
            type: eventData.type,
          })))
  );

  return (
    <div className="flex flex-col gap-4 relative px-4 lg:px-0">
      {eventData?.type === "event" && (
        <>
          {(eventRole === "manager" || eventRole === "admin") && (
            <EventManagementDropdown
              eventId={props.eventId}
              className="absolute top-1 right-2 hidden lg:block"
              role={eventRole}
            />
          )}
          <div className="block lg:hidden">
            <EventDescription text={eventData?.description ?? ""} />
          </div>
          <div className="hidden lg:block bg-neutral-800/20 rounded-2xl border border-neutral-800/50 overflow-hidden p-4 lg:shadow-lg">
            <EventDescription
              text={eventData?.description ?? ""}
              defaultOpen={true}
            />
          </div>
        </>
      )}
      {showLocation && (
        <div className="flex flex-col gap-px rounded-2xl bg-neutral-800/20 border border-neutral-800/50 overflow-hidden lg:shadow-lg">
          <MapView
            location={eventData.location}
            className="mb-0 w-full h-48 overflow-hidden mt-0 rounded-2xl"
          />
          <div className="flex items-center gap-2 px-4 py-2 w-full">
            <MapPinIcon className="w-4 h-4" />
            <p className="text-sm">{eventData.location}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PromotionCodeExpiryView = async (props: {
  promotionCode: string;
  eventId: string;
}) => {
  const db = getDb();

  const foundPromotionCode = await db.query.promotionCodes.findFirst({
    columns: {
      maxUses: true,
    },
    where: and(
      eq(promotionCodes.code, props.promotionCode),
      eq(promotionCodes.eventId, props.eventId)
    ),
    with: {
      tickets: {
        where: eq(tickets.status, "success"),
        columns: {
          quantity: true,
        },
      },
    },
  });

  if (!foundPromotionCode) {
    return null;
  }

  const ticketsSold = foundPromotionCode.tickets.reduce(
    (sum, e) => sum + e.quantity,
    0
  );
  const isSoldOut = ticketsSold >= foundPromotionCode.maxUses;

  if (!isSoldOut) {
    return null;
  }

  return <PromotionCodeExpiryNotification />;
};

const EventHeaderView = async (props: { eventId: string }) => {
  const [eventData, { foundTicket }, eventRole] = await Promise.all([
    getEventData(props.eventId),
    getTicketTiers(props.eventId),
    getUserEventRole(props.eventId),
  ]);

  const discussionEnabled = Boolean(
    eventData &&
      isDiscussionEnabled({
        startTime: eventData.startTime,
        type: eventData.type,
        isTicketFound: Boolean(foundTicket),
        role: eventRole,
      })
  );

  if (!eventData) {
    redirect("/");
  }

  return (
    <EventHeader
      role={eventRole}
      name={eventData.name}
      startTime={eventData.startTime}
      posterUrl={eventData.eventMedia.find((e) => e.isPoster)?.url ?? ""}
      eventId={props.eventId}
      isDiscussionEnabled={discussionEnabled}
    />
  );
};

const TicketTiersView = async (props: { eventId: string }) => {
  const [
    eventData,
    { foundTicket, currentTicketPrices },
    ticketsSold,
    eventRole,
  ] = await Promise.all([
    getEventData(props.eventId),
    getTicketTiers(props.eventId),
    getSoldTickets(props.eventId),
    getUserEventRole(props.eventId),
  ]);

  const userAuth = auth();

  const isAtCapacity = !eventData || ticketsSold >= eventData.capacity;

  const discussionEnabled = Boolean(
    eventData &&
      isDiscussionEnabled({
        startTime: eventData.startTime,
        type: eventData.type,
        isTicketFound: Boolean(foundTicket),
        role: eventRole,
      })
  );

  return (
    <>
      {eventData?.type === "discussion" && discussionEnabled && (
        <div className="flex flex-col mt-4">
          <Link
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 font-semibold flex justify-center gap-4 items-center rounded-2xl shadow-lg transition flex-1 w-full"
            href={`/events/${props.eventId}/chat`}
          >
            <div className="relative">
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
              <div className="animate-pulse absolute bg-green-500 rounded-full w-2 h-2 top-0 right-0 translate-x-1/4 -translate-y-1/4" />
            </div>
            <p>Join Discussion</p>
          </Link>
        </div>
      )}
      {eventData?.type === "event" && (
        <div className="flex flex-col px-4 lg:px-0 gap-4 mt-4">
          {/* Event is at capacity and user has not purchased a ticket */}
          {isAtCapacity && !foundTicket && (
            <div className="flex items-center border border border-neutral-800/50 bg-neutral-800/20 shadow-lg rounded-2xl p-4 gap-4 items-center flex w-full">
              <ExclamationCircleIcon className="w-6 h-6" />
              <p className="text-center font-medium text-sm">
                Event is at capacity
              </p>
            </div>
          )}

          {/* No ticket, but have ticket prices. Show ticket prices */}
          {/* {!isAtCapacity &&
            foundTicket === null &&
            currentTicketPrices.length > 0 && (
              <div className="flex flex-col gap-2">
                {currentTicketPrices.map((price) => (
                  <TicketTierListing
                    eventId={props.eventId}
                    data={price}
                    key={price.id}
                    disabled={userAuth?.userId === eventData.userId}
                  />
                ))}
              </div>
            )} */}
          <div className="flex items-center gap-4 lg:flex-row flex-col">
            {discussionEnabled ? (
              <Link
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 font-semibold flex justify-center gap-4 items-center rounded-2xl shadow-lg transition flex-1 w-full"
                href={`/events/${props.eventId}/chat`}
              >
                <div className="relative">
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                  <div className="animate-pulse absolute bg-green-500 rounded-full w-2 h-2 top-0 right-0 translate-x-1/4 -translate-y-1/4" />
                </div>
                <p>Join Discussion</p>
              </Link>
            ) : (
              <JoinDiscussionAlertDialog>
                <button className="bg-secondary text-secondary-foreground px-6 py-3 font-semibold flex justify-center gap-4 items-center rounded-2xl shadow-lg transition flex-1 opacity-50 w-full">
                  <div className="relative">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                    <div className="animate-pulse absolute bg-green-500 rounded-full w-2 h-2 top-0 right-0 translate-x-1/4 -translate-y-1/4" />
                  </div>
                  <p>Join Discussion</p>
                </button>
              </JoinDiscussionAlertDialog>
            )}
            {/* No ticket, but have ticket prices. Show ticket prices */}
            {!isAtCapacity &&
              foundTicket === null &&
              currentTicketPrices.length > 0 && (
                <TicketTiersDialog
                  data={currentTicketPrices.map((e) => ({
                    data: e,
                    disabled: userAuth?.userId === eventData.userId,
                    eventId: props.eventId,
                  }))}
                >
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-semibold flex justify-center gap-4 items-center rounded-2xl shadow-white shadow-lg transition hover:shadow-neutral-300 flex-1 w-full">
                    <TicketIcon className="h-6 w-6" />
                    <p>Buy Tickets</p>
                  </button>
                </TicketTiersDialog>
              )}
            {/* Found a ticket */}
            {foundTicket && (
              <Link
                href={`/events/${props.eventId}/tickets/${foundTicket.id}`}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-semibold flex justify-center gap-2 items-center rounded-2xl shadow-white shadow-lg transition hover:shadow-neutral-300 flex-1 w-full"
              >
                <TicketIcon className="mr-2 h-5 w-5" />
                <p>{`View Ticket${foundTicket.quantity > 1 ? "s" : ""}`}</p>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
