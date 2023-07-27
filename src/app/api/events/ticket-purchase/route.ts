import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { match } from "ts-pattern";
import { z } from "zod";
import { getDb } from "~/db/client";
import { events, tickets } from "~/db/schema";
import { generateSlug } from "~/utils/generateSlug";
import { getStripeClient } from "~/utils/stripe";

const requestDataSchema = z.object({
  data: z.object({
    object: z.object({ id: z.string(), object: z.enum(["payment_intent"]) }),
  }),
});

export const POST = async (req: Request) => {
  const requestData = await req.json();
  const data = requestDataSchema.safeParse(requestData);
  const db = getDb();

  if (!data.success) {
    console.error(requestData);
    console.error(data.error.message);
    return NextResponse.json(
      { error: true, message: data.error.message },
      { status: 400 }
    );
  }

  const stripe = getStripeClient();

  const paymentIntent = await stripe.paymentIntents.retrieve(
    data.data.data.object.id
  );

  console.log(JSON.stringify(paymentIntent, null, 2));
  const session = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    expand: ["data.line_items"],
  });

  const eventSlug = await match(process.env.NODE_ENV)
    .with("production", () => session?.data[0]?.metadata?.eventSlug)
    .otherwise(async () => {
      const firstEvent = await db.query.events.findFirst({
        columns: {
          slug: true,
        },
      });

      if (!firstEvent) {
        throw new Error("Could not find any events");
      }

      return firstEvent.slug;
    });

  console.log(JSON.stringify(session, null, 2));

  if (!eventSlug) {
    return NextResponse.json(
      {
        error: true,
        message: "Missing event slug",
      },
      { status: 400 }
    );
  }

  const eventData = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
  });

  if (!eventData) {
    return NextResponse.json(
      {
        error: true,
        message: `Couldn't find event matching slug ${eventSlug}`,
      },
      { status: 400 }
    );
  }

  await db
    .insert(tickets)
    .values({
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: generateSlug(),
      eventId: eventData.id,
      quantity: 1,
      ticketPriceId: "",
      userId: "",
    })
    .returning()
    .get();

  const { ticketsSold } = await db
    .select({ ticketsSold: sql<number>`count(*)` })
    .from(tickets)
    .where(eq(tickets.eventId, eventData.id))
    .get();

  return NextResponse.json({});
};
