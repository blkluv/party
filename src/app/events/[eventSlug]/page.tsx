import { auth } from "@clerk/nextjs";
import { asc, eq } from "drizzle-orm";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { EventAdminToolbar } from "~/app/_components/EventAdminToolbar";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { eventMedia, events, ticketPrices } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import { TicketTierListing } from "./TicketTierListing";

export const dynamic = "force-dynamic";
type PageProps = { params: { eventSlug: string } };

const getEventData = cache(async (slug: string) => {
  const db = getDb();
  return await db.query.events.findFirst({
    columns: {
      description: true,
      name: true,
      startTime: true,
      id: true,
      userId: true,
      slug: true,
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
    where: eq(events.slug, slug),
  });
});

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const eventData = await getEventData(props.params.eventSlug);

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
        fallback={<LoadingSpinner size={55} className="mt-16 mx-auto" />}
      >
        <EventView eventSlug={props.params.eventSlug} />
      </Suspense>
    </div>
  );
};

const EventView = async (props: { eventSlug: string }) => {
  const eventData = await getEventData(props.eventSlug);

  if (!eventData) {
    redirect("/");
  }

  const userAuth = auth();

  const isEventAdmin =
    userAuth.userId === eventData.userId || (await isUserPlatformAdmin());

  return (
    <>
      <div className="relative h-96 w-full rounded-xl overflow-hidden">
        <div className="bg-neutral-800 animate-pulse inset-0 absolute z-0" />
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
          <EventAdminToolbar
            eventId={eventData.id}
            eventSlug={eventData.slug}
          />
        </div>
      )}
      <div className="space-y-2">
        <h1 className="font-bold text-2xl text-center">{eventData.name}</h1>
        <p className="text-sm text-center text-gray-200">
          <ClientDate date={eventData.startTime} />
        </p>
        <p className="text-center">{eventData.description}</p>
      </div>

      <div className="space-y-2">
        <p className="text-gray-100 font-semibold text-lg text-center">
          Ticket Tiers
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {eventData.ticketPrices.map((price) => (
            <TicketTierListing
              key={`ticket price ${price.id}`}
              eventId={eventData.id}
              data={price}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
