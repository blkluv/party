import { auth } from "@clerk/nextjs";
import { asc, eq } from "drizzle-orm";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cache } from "react";
import { EventAdminToolbar } from "~/app/_components/EventAdminToolbar";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_WEBSITE_URL
  ),
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

export const generateMetadata = async (
  props: PageProps,
  _parent?: ResolvingMetadata
): Promise<Metadata> => {
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
      url: env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_WEBSITE_URL,
      images,
      title: getPageTitle(eventData.name),
      description: eventData.description,
    },
  };
};

const Page = async (props: PageProps) => {
  const eventData = await getEventData(props.params.eventSlug);

  if (!eventData) {
    redirect("/");
  }

  const userAuth = auth();

  const isEventAdmin =
    userAuth.userId === eventData.userId || (await isUserPlatformAdmin());

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-2">
      <div className="relative h-96 w-full rounded-xl overflow-hidden">
        <Image
          src={eventData.eventMedia.find((e) => e.isPoster)?.url ?? ""}
          width={1200}
          height={1200}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      {isEventAdmin && (
        <div className="flex justify-center">
          <EventAdminToolbar eventId={eventData.id} />
        </div>
      )}
      <div className="space-y-2">
        <h1 className="font-bold text-2xl text-center">{eventData.name}</h1>
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
    </div>
  );
};

export default Page;
