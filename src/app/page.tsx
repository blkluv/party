import { and, eq, gt } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getDb } from "~/db/client";
import { eventMedia, events } from "~/db/schema";
import { ClientDate } from "./_components/ClientDate";

export const dynamic = "force-dynamic";

export const getFeaturedEvents = async () => {
  const db = getDb();
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
    where: and(gt(events.startTime, new Date()), eq(events.isPublic, true)),
  });

  return foundEvents;
};

const Page = async () => {
  const foundEvents = await getFeaturedEvents();

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="fixed top-0 left-0 right-0">
        <div className="inset-0 z-10 absolute" />
        <div className="h-screen z-0 brightness-[40%]">
          <Image
            src="/images/party-people.jpg"
            width={600}
            height={1000}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <h1 className="rainbow-text font-bold text-6xl sm:text-8xl text-center my-32 whitespace-nowrap relative z-20">
        Party Box
      </h1>
      <div className="flex flex-col gap-4 max-w-2xl m-2 sm:mx-auto relative z-20 pb-16 sm:pb-0">
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
          className="relative sm:h-48"
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
