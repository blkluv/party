import { auth } from "@clerk/nextjs";
import {
  ChatBubbleBottomCenterTextIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { and, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { FC } from "react";
import { Suspense, cache } from "react";
import { getDb } from "~/db/client";
import { eventMedia, events, tickets } from "~/db/schema";
import { isEventOver } from "~/utils/event-time-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { ClientDate } from "../_components/ClientDate";

export const metadata: Metadata = {
  title: getPageTitle("My Events"),
};

export const dynamic = "force-dynamic";

const Page = async () => {
  return (
    <div className="w-full max-w-lg mx-auto my-8 px-2">
      <Suspense fallback={<EventsLoadingSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  );
};

const EventsLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div
          key={`events list skeleton ${i}`}
          className="bg-neutral-800 animate-pulse w-full h-32 rounded-lg"
        ></div>
      ))}
    </div>
  );
};

const getEvents = cache(async () => {
  const userAuth = auth();
  const db = getDb();

  if (!userAuth.userId) {
    return [];
  }

  const foundEvents = await db.query.events.findMany({
    where: and(eq(tickets.userId, userAuth.userId)),
    columns: {
      id: true,
      name: true,
      description: true,
      startTime: true,
      type: true,
    },
    with: {
      eventMedia: {
        where: eq(eventMedia.isPoster, true),
        columns: {
          url: true,
        },
      },
    },
    orderBy: desc(events.startTime),
  });

  return foundEvents;
});

const EventsList = async () => {
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const foundEvents = await getEvents();

  const upcomingEvents = foundEvents.filter((e) => !isEventOver(e.startTime));
  const pastEvents = foundEvents.filter((e) => isEventOver(e.startTime));

  return (
    <div className="flex flex-col gap-4">
      {foundEvents.length === 0 && (
        <p className="font-medium text-sm text-center text-neutral-400">
          No events
        </p>
      )}
      {upcomingEvents.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-center">Upcoming Events</p>
          {upcomingEvents.map((e) => (
            <EventListing key={e.id} data={e} />
          ))}
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-center">Past events</p>
          {pastEvents.map((e) => (
            <EventListing key={e.id} data={e} />
          ))}
        </div>
      )}
    </div>
  );
};

const EventListing: FC<{
  data: Awaited<ReturnType<typeof getEvents>>[number];
}> = (props) => {
  return (
    <Link
      href={`/events/${props.data.id}`}
      className="relative hover:scale-105 transition"
    >
      <div className="absolute rounded-lg overflow-hidden inset-0 w-full brightness-[60%] dark:bg-neutral-900">
        <div className="absolute -inset-24 backdrop-blur-lg z-10" />
        <div className="absolute inset-0">
          <Image
            src={props.data.eventMedia[0]?.url ?? ""}
            alt=""
            width={300}
            height={300}
            className="w-full h-full object-cover z-0"
          />
        </div>
      </div>
      <div className="relative z-20 p-4 sm:p-8 text-white flex">
        <div className="flex-1 overflow-hidden">
          <h2 className="font-bold text-xl truncate">{props.data.name}</h2>
          <p className="text-sm">
            <ClientDate date={props.data.startTime} />
          </p>
        </div>
        <div className="flex items-center justify-center text-white shrink-0">
          {props.data.type === "event" ? (
            <TicketIcon className="w-6 h-6" />
          ) : (
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Page;
