import { CubeIcon } from "@heroicons/react/24/outline";
import { and, asc, eq, gt } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getDb } from "~/db/client";
import { eventMedia, events } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { ClientDate } from "./_components/ClientDate";
import { SearchEvents } from "./_components/search-events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Home"),
};

const getFeaturedEvents = async () => {
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
      gt(events.startTime, new Date()),
      eq(events.isPublic, true),
      eq(events.isFeatured, true)
    ),
  });

  return foundEvents;
};

const EventsListLoadingSkeleton = () => {
  return (
    <>
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div
          key={`events list skeleton ${i}`}
          className="bg-neutral-800 animate-pulse w-full h-32 rounded-lg"
        ></div>
      ))}
    </>
  );
};

const Page = async () => {
  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <div className="mt-32 w-full">
        <div className="text-white flex gap-4 items-center justify-center relative">
          <div className="bg-white/10 blur-[100px] rounded-[100%] absolute w-[600px] h-96 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2" />
          <CubeIcon className="w-12 h:12 sm:w-16 sm:h-16" />
          <h1 className="font-bold text-5xl sm:text-6xl whitespace-nowrap">
            Party Box
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 max-w-2xl px-2 sm:mx-auto w-full relative z-20 pb-4 mt-32">
        <p className="font-semibold text-white text-lg text-center">
          Featured Events
        </p>
        <Suspense fallback={<EventsListLoadingSkeleton />}>
          <EventsList />
        </Suspense>
        <div className="mt-16">
          <SearchEvents />
        </div>
      </div>
    </div>
  );
};

const EventsList = async () => {
  const foundEvents = await getFeaturedEvents();

  return (
    <>
      {foundEvents.length === 0 && (
        <p className="font-medium text-sm text-center text-neutral-400">
          No events found. Check again later.
        </p>
      )}
      {foundEvents.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.id}`}
          className="relative hover:scale-105 transition"
        >
          <div className="absolute rounded-lg overflow-hidden inset-0 w-full brightness-[60%] dark:bg-neutral-900">
            <div className="absolute -inset-24 backdrop-blur-lg z-10" />
            <div className="absolute inset-0">
              <Image
                src={e.eventMedia[0]?.url ?? ""}
                alt=""
                width={300}
                height={300}
                className="w-full h-full object-cover z-0"
              />
            </div>
          </div>
          <div className="relative z-20 p-4 sm:p-8 text-white">
            <h2 className="font-bold text-xl overflow-hidden">{e.name}</h2>
            <p className="text-sm">
              <ClientDate date={e.startTime} />
            </p>
            <p className="mt-4 truncate">{e.description}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Page;
