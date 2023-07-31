import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDb } from "~/db/client";
import { eventMedia, tickets } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { ClientDate } from "../_components/ClientDate";

export const metadata: Metadata = {
  title: getPageTitle("My Tickets"),
};

const Page = async () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <Suspense fallback={<TicketsLoadingSkeleton />}>
        <TicketsList />
      </Suspense>
    </div>
  );
};

const TicketsLoadingSkeleton = () => {
  return (
    <>
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div
          key={`events list skeleton ${i}`}
          className="bg-neutral-800 animate-pulse w-full h-32 rounded-lg my-8"
        ></div>
      ))}
    </>
  );
};

const TicketsList = async () => {
  const userAuth = auth();
  const db = getDb();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const foundTickets = await db.query.tickets.findMany({
    where: and(
      eq(tickets.userId, userAuth.userId),
      eq(tickets.status, "success")
    ),
    columns: {
      quantity: true,
      slug: true,
      id: true,
    },
    with: {
      event: {
        columns: {
          id: true,
          slug: true,
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
      },
    },
  });

  foundTickets.sort(
    (a, b) => a.event.startTime.getTime() - b.event.startTime.getTime()
  );

  return (
    <div className="flex flex-col gap-2 my-8">
      {foundTickets.length === 0 && (
        <p className="font-medium text-sm text-center text-neutral-400">
          No tickets
        </p>
      )}
      {foundTickets.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.event.slug}/ticket/${e.slug}`}
          className="relative hover:scale-105 transition"
        >
          <div className="absolute rounded-lg overflow-hidden inset-0 w-full brightness-[60%] dark:bg-neutral-900">
            <div className="absolute -inset-24 backdrop-blur-lg z-10" />
            <div className="absolute inset-0">
              <Image
                src={e.event.eventMedia[0]?.url ?? ""}
                alt=""
                width={300}
                height={300}
                className="w-full h-full object-cover z-0"
              />
            </div>
          </div>
          <div className="relative z-20 p-4 sm:p-8 text-white">
            <h2 className="font-bold text-xl overflow-hidden">
              {e.event.name}
            </h2>
            <p className="text-sm">
              <ClientDate date={e.event.startTime} />
            </p>
            <p className="text-sm">{`${e.quantity} ticket${
              e.quantity > 1 ? "s" : ""
            }`}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;
