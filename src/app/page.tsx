import { CubeIcon } from "@heroicons/react/24/outline";
import { and, asc, eq, gt, inArray, sql } from "drizzle-orm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { eventMedia, events, ticketPrices } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { ClientDate } from "./_components/ClientDate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Home"),
  description:
    "Party Box is a cutting-edge web platform that aims to revolutionize the way university students discover and share parties and events. Party Box caters to the spontaneous nature of parties and other gatherings, empowering users to stay socially connected.",
  openGraph: {
    url: env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_WEBSITE_URL,
    images: [{ url: "/images/partybox-meta.png", width: 1200, height: 630 }],
    title: getPageTitle("Home"),
    description:
      "Party Box is a cutting-edge web platform that aims to revolutionize the way university students discover and share parties and events. Party Box caters to the spontaneous nature of parties and other gatherings, empowering users to stay socially connected.",
  },
};

const getFeaturedEvents = async () => {
  const db = getDb();

  const paidEventsQuery = await db
    .select({ eventId: sql<number>`distinct ${ticketPrices.eventId}` })
    .from(ticketPrices)
    .where(eq(ticketPrices.isFree, false))
    .all();

  if (paidEventsQuery.length === 0) {
    return [];
  }

  const foundEvents = await db.query.events.findMany({
    columns: {
      description: true,
      id: true,
      name: true,
      startTime: true,
      slug: true,
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
      inArray(
        events.id,
        paidEventsQuery.map((e) => e.eventId)
      )
    ),
  });

  return foundEvents;
};

const Page = async () => {
  const foundEvents = await getFeaturedEvents();

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="fixed top-36 left-0 right-0">
        <div className="text-white flex gap-4 items-center justify-center relative">
          <div className="bg-white/10 blur-[100px] rounded-[100%] absolute w-[600px] h-96 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2" />
          <CubeIcon className="w-12 h:12 sm:w-16 sm:h-16" />
          <h1 className="font-bold text-5xl sm:text-6xl whitespace-nowrap">
            Party Box
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 max-w-2xl m-2 sm:mx-auto relative z-20 pb-4 mt-96">
        <p className="font-semibold text-white text-lg text-center">
          Featured Events
        </p>
        <EventsList events={foundEvents} />
      </div>
    </div>
  );
};

const EventsList: FC<{
  events: Awaited<ReturnType<typeof getFeaturedEvents>>;
}> = (props) => {
  return (
    <>
      {props.events.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.slug}`}
          className="relative sm:h-48 hover:scale-105 transition"
        >
          <div className="absolute rounded-lg overflow-hidden inset-0 w-full brightness-[60%]">
            <div className="absolute -inset-24 backdrop-blur-lg z-10" />
            <div className="absolute inset-0">
              <Image
                src={e.eventMedia[0].url ?? ""}
                alt=""
                width={300}
                height={300}
                className="w-full h-full object-cover z-0"
              />
            </div>
          </div>
          <div className="relative z-20 p-4 text-white">
            <h2 className="font-bold text-xl overflow-hidden">{e.name}</h2>
            <p className="text-sm">
              <ClientDate date={e.startTime} />
            </p>
            <p className="mt-4 overflow-hidden">{e.description.repeat(10)}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Page;
