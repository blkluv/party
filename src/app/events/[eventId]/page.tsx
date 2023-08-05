import { auth } from "@clerk/nextjs";
import { TicketIcon } from "@heroicons/react/24/outline";
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
import { getPageTitle } from "~/utils/getPageTitle";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import { TicketTierListing } from "./TicketTierListing";

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
        eq(tickets.userId, userAuth.userId)
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

  const userAuth = auth();

  const isEventAdmin =
    userAuth.userId === eventData.userId || (await isUserPlatformAdmin());

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
      {isEventAdmin && (
        <div className="flex justify-center">
          <EventAdminToolbar eventId={eventData.id} />
        </div>
      )}
      <div className="space-y-2">
        <h1 className="font-bold text-2xl text-center">{eventData.name}</h1>
        <p className="text-sm text-center text-gray-200">
          <ClientDate date={eventData.startTime} />
        </p>
        <p className="text-center">{eventData.description}</p>
      </div>
    </>
  );
};

const TicketTiersView = async (props: { eventId: string }) => {
  const foundTicketPrices = await getTicketTiers(props.eventId);

  return (
    <div className="flex flex-col gap-2">
      {foundTicketPrices.foundTicket === null && (
        <>
          <p className="text-gray-100 font-semibold text-lg text-center">
            Ticket Tiers
          </p>
          <div className="flex justify-center gap-2 flex-wrap"></div>
          {foundTicketPrices.ticketPrices.map((price) => (
            <TicketTierListing
              key={`ticket price ${price.id}`}
              eventId={props.eventId}
              data={price}
            />
          ))}
        </>
      )}
      {foundTicketPrices.foundTicket && (
        <Link
          className="mx-auto"
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
