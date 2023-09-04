import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDb } from "~/db/client";
import { eventMedia, tickets } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { refreshTicketStatus } from "~/utils/refreshTicketStatus";
import { ClientDate } from "../_components/ClientDate";

export const metadata: Metadata = {
  title: getPageTitle("My Tickets"),
};

export const dynamic = "force-dynamic";

const Page = async () => {
  return (
    <div className="w-full max-w-lg mx-auto my-8 px-2">
      <Suspense fallback={<TicketsLoadingSkeleton />}>
        <TicketsList />
      </Suspense>
    </div>
  );
};

const TicketsLoadingSkeleton = () => {
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

const TicketsList = async () => {
  const userAuth = auth();
  const db = getDb();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const foundTickets = await db.query.tickets.findMany({
    where: eq(tickets.userId, userAuth.userId),
    with: {
      event: {
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
      },
      price: {
        columns: {
          isFree: true,
        },
      },
    },
  });

  foundTickets.sort(
    (a, b) => a.event.startTime.getTime() - b.event.startTime.getTime()
  );

  const validTickets = (
    await Promise.allSettled(
      foundTickets.map(async (t) => {
        if (t.status === "pending") {
          const refreshedData = await refreshTicketStatus(t);
          if (refreshedData) {
            return {
              ...t,
              status: refreshedData.status,
              quantity: refreshedData.quantity,
            };
          }
        } else if (t.status === "success") {
          return t;
        }

        throw new Error();
      })
    )
  )
    .filter(
      (e): e is PromiseFulfilledResult<(typeof foundTickets)[number]> =>
        e.status === "fulfilled"
    )
    .map((e) => e.value);

  return (
    <div className="flex flex-col gap-2">
      {validTickets.length === 0 && (
        <p className="font-medium text-sm text-center text-neutral-400">
          No tickets
        </p>
      )}
      {validTickets.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.event.id}/tickets/${e.id}`}
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
