import { asc, eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getDb } from "~/db/client";
import { eventMedia, events, ticketPrices } from "~/db/schema";
import { TicketTierListing } from "./TicketTierListing";

export const dynamic = "force-dynamic";

const Page = async (props: { params: { eventSlug: string } }) => {
  const db = getDb();
  const eventData = await db.query.events.findFirst({
    columns: {
      description: true,
      name: true,
      startTime: true,
      id: true,
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
    where: eq(events.slug, props.params.eventSlug),
  });

  if (!eventData) {
    redirect("/");
  }

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
