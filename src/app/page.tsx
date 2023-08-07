import { currentUser } from "@clerk/nextjs";
import {
  ArrowRightCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  CubeIcon,
  HomeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { and, asc, eq, gt } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { Suspense } from "react";
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
          className="bg-neutral-800 animate-pulse w-full sm:h-64 rounded-lg"
        ></div>
      ))}
    </>
  );
};

const Page = async () => {
  const user = await currentUser();
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
        {user && (
          <Link href="/events/new" className="mx-auto">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              <p>Create Discussion</p>
            </Button>
          </Link>
        )}
        <div className="space-y-2">
          <p className="font-semibold text-white text-lg text-center">
            Featured Events
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
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
        <p className="font-medium text-sm text-center text-neutral-400">
          No events found. Check again later.
        </p>
      )}
      {foundEvents.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.id}`}
          className="relative hover:scale-105 h-64 group transition flex flex-col rounded-xl overflow-hidden justify-end"
        >
          <div className="absolute inset-0 w-full dark:bg-neutral-900">
            <div className="absolute -inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
            <div className="absolute inset-0 z-0">
              <Image
                src={e.eventMedia[0]?.url ?? ""}
                alt=""
                width={300}
                height={300}
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

export const UpcomingEvents = async () => {
  const data = await getUpcomingPublicEvents();

  return (
    <div className="flex flex-col">
      <p className="font-semibold text-white text-lg text-center">
        Upcoming Events
      </p>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 mt-4">
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
    <div className="rounded-3xl hover:bg-neutral-900 transition duration-75 flex flex-col sm:items-center sm:hover:bg-neutral-800 sm:bg-neutral-800/50 sm:flex-row h-72 sm:h-auto sm:w-auto gap-2 relative sm:p-2">
      <div className="rounded-2xl overflow-hidden shrink-0 inset-0 absolute sm:relative sm:h-32 sm:w-32">
        <Image
          src={props.data.imageUrl}
          alt=""
          width={300}
          height={300}
          className="object-cover w-full h-full z-0 relative"
        />
      </div>
      <div className="flex flex-col gap-1 items-center sm:items-start text-center z-10 absolute sm:left-auto sm:right-auto sm:bottom-auto left-4 right-4 bottom-4 sm:relative bg-neutral-900 sm:bg-transparent p-4 rounded-xl sm:flex-1">
        <p className="font-medium whitespace-pre-wrap text-sm">
          {props.data.name}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs">
          <HomeIcon className="w-4 h-4" />
          <p>{props.data.location}</p>
        </div>
      </div>
      <div className="sm:flex sm:flex-col sm:gap-2 sm:items-start sm:px-8 lg:px-0">
        <div className="absolute top-4 rounded-full p-2 sm:relative left-4 sm:left-auto sm:top-auto bg-neutral-900 sm:bg-transparent z-10">
          <EventTimer startTime={props.data.startTime} />
        </div>

        <Link
          href={`/events/${props.data.id}/chat`}
          className="absolute top-4 rounded-full p-2 right-16 sm:relative sm:right-auto sm:top-auto bg-neutral-900 z-10 sm:bg-transparent hover:bg-neutral-800 transition flex justify-center items-center gap-1 text-sm sm:hover:bg-neutral-700"
        >
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-white" />
          <p className="hidden sm:block">Chat</p>
        </Link>
        <Link
          href={`/events/${props.data.id}`}
          className="absolute top-4 rounded-full p-2 right-4 sm:relative sm:right-auto sm:top-auto bg-neutral-900 z-10 sm:bg-transparent hover:bg-neutral-800 transition flex justify-center items-center gap-1 text-sm sm:hover:bg-neutral-700"
        >
          <ArrowRightCircleIcon className="w-5 h-5 text-white" />
          <p className="hidden sm:block">View</p>
        </Link>
      </div>
    </div>
  );
};

export default Page;
