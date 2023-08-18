import {
  ChatBubbleBottomCenterTextIcon,
  CubeIcon,
  MapPinIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { and, asc, eq, gte } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { Suspense, cache } from "react";
import { MAX_EVENT_DURATION_HOURS } from "~/config/constants";
import { getDb } from "~/db/client";
import { eventMedia, events } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUpcomingPublicEvents } from "~/utils/getUpcomingPublicEvents";
import { ClientDate } from "./_components/ClientDate";
import { EventTimer } from "./_components/search-events";
import { Button } from "./_components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Home"),
};

const getFeaturedEvents = cache(async () => {
  const db = getDb();

  const foundEvents = await db.query.events.findMany({
    columns: {
      description: true,
      id: true,
      name: true,
      startTime: true,
    },
    with: {
      eventMedia: {
        where: eq(eventMedia.isPoster, true),
      },
    },
    orderBy: asc(events.startTime),
    where: and(
      gte(
        events.startTime,
        dayjs().subtract(MAX_EVENT_DURATION_HOURS, "hours").toDate()
      ),
      eq(events.isPublic, true),
      eq(events.isFeatured, true)
    ),
  });

  return foundEvents;
});

const EventsListLoadingSkeleton = () => {
  return (
    <>
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div
          key={`events list skeleton ${i}`}
          className="h-64 rounded-xl overflow-hidden md:w-[45%] lg:w-[30%] shrink-0 w-full bg-neutral-800 animate-pulse"
        ></div>
      ))}
    </>
  );
};

const Page = async () => {
  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden gap-32">
      <div className="w-full mt-32">
        <div className="text-white flex gap-4 items-center justify-center relative">
          <div className="bg-white/10 blur-[100px] rounded-[100%] absolute w-[600px] h-96 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-0" />
          <CubeIcon className="w-12 h:12 sm:w-16 sm:h-16 relative z-10" />
          <h1 className="font-bold text-5xl sm:text-6xl whitespace-nowrap relative z-10">
            Party Box
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-16 max-w-6xl px-2 sm:mx-auto w-full relative pb-4">
        <Link href="/events/new?discussion=true" className="mx-auto">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            <p>Start an Event Discussion</p>
          </Button>
        </Link>
        <div className="space-y-2">
          <p className="font-semibold text-white text-lg text-center">
            Featured Events
          </p>
          <div className="flex gap-2 flex-wrap flex-row justify-center">
            <Suspense fallback={<EventsListLoadingSkeleton />}>
              <FeaturedEventsList />
            </Suspense>
          </div>
        </div>

        <div className="mt-16">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

const FeaturedEventsList = async () => {
  const foundEvents = await getFeaturedEvents();

  return (
    <>
      {foundEvents.length === 0 && (
        <p className="font-medium text-sm text-center text-neutral-400 sm:col-start-2">
          No events found. Check again later.
        </p>
      )}
      {foundEvents.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.id}`}
          className="relative hover:scale-105 h-64 group transition flex flex-col rounded-xl overflow-hidden justify-end md:w-[45%] lg:w-[30%] shrink-0 w-full"
        >
          <div className="absolute inset-0 w-full dark:bg-neutral-900">
            <div className="absolute -inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
            <div className="absolute inset-0 z-0">
              <Image
                src={e.eventMedia[0]?.url ?? ""}
                alt=""
                width={600}
                height={600}
                className="w-full h-full object-cover z-0"
              />
            </div>
          </div>
          <div className="relative z-20 p-4 sm:p-8 text-white flex flex-col">
            <h2 className="font-bold text-xl overflow-hidden">{e.name}</h2>
            <p className="text-sm text-neutral-300">
              <ClientDate date={e.startTime} />
            </p>
            <p className="truncate">{e.description}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

const UpcomingEvents = async () => {
  const data = await getUpcomingPublicEvents();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <p className="font-semibold text-white text-lg text-center">Events</p>
      <div className="flex flex-col gap-2 mt-4 w-full max-w-xl mx-auto">
        {data.map((e) => (
          <UpcomingEventListing data={e} key={e.id} />
        ))}
      </div>
    </div>
  );
};

const UpcomingEventListing: FC<{
  data: Awaited<ReturnType<typeof getUpcomingPublicEvents>>[number];
}> = (props) => {
  return (
    <div className="bg-black rounded-2xl relative h-16 sm:h-20 hover:bg-black/50 transition overflow-hidden border border-neutral-800">
      <Link
        className="flex items-center pl-12 sm:pl-16 gap-4 sm:gap-8 py-4 pr-4 h-full w-full z-0"
        href={`/events/${props.data.id}`}
      >
        <div className="flex-1 overflow-hidden space-y-1">
          <p className="text-sm truncate sm:font-semibold sm:text-base">
            {props.data.name}
          </p>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 " />
            <p className="text-xs sm:text-sm truncate">{props.data.location}</p>
          </div>
        </div>
        <EventTimer startTime={props.data.startTime} />
      </Link>
      <div className="flex gap-2 absolute left-4 top-0 bottom-0 items-center justify-end z-10">
        <Link
          href={`/events/${props.data.id}/chat`}
          className="transition hover:text-neutral-300 sm:w-8 sm:h-8 flex items-center justify-center"
        >
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5 sm:w-6 sm:h-6 white" />
        </Link>
      </div>
    </div>
  );
};

export default Page;
