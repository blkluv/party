import { auth } from "@clerk/nextjs";
import { and, asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDb } from "~/db/client";
import { eventMedia, events, tickets } from "~/db/schema";
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

const EventsList = async () => {
  const userAuth = auth();
  const db = getDb();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const foundEvents = await db.query.events.findMany({
    where: and(eq(tickets.userId, userAuth.userId)),
    columns: {
      id: true,
      name: true,
      description: true,
      startTime: true,
    },
    with: {
      eventMedia: {
        where: eq(eventMedia.isPoster, true),
        columns: {
          url: true,
        },
      },
    },
    orderBy: asc(events.startTime),
  });

  foundEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="flex flex-col gap-2">
      {foundEvents.length === 0 && (
        <p className="font-medium text-sm text-center text-neutral-400">
          No events
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
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;
