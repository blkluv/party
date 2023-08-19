import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { promotionCodes, ticketPrices, tickets } from "~/db/schema";
import { getSoldTickets } from "./getSoldTickets";
import { getStripeClient } from "./stripe";

export const createTicketPurchaseUrl = async (args: {
  userId: string;
  ticketPriceId: string;
  promotionCode?: string;
}) => {
  const db = getDb();
  const stripe = getStripeClient();

  const ticketPriceData = await db.query.ticketPrices.findFirst({
    where: eq(ticketPrices.id, args.ticketPriceId),
    with: {
      event: {
        columns: {
          id: true,
          capacity: true,
        },
      },
    },
  });

  if (!ticketPriceData) {
    throw new Error("Ticket price not found");
  }

  const ticketsSold = await getSoldTickets(ticketPriceData.eventId);

  if (ticketsSold >= ticketPriceData.event.capacity) {
    throw new Error("Event is at capacity");
  }

  // Does the user already have a ticket for this event?
  const existingTicket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.eventId, ticketPriceData.eventId),
      eq(tickets.userId, args.userId),
      eq(tickets.status, "success")
    ),
  });

  // Send the user to their existing ticket
  if (existingTicket) {
    return `/events/${ticketPriceData.event.id}/tickets/${existingTicket.id}`;
  }

  const ticketId = createId();

  let stripeSessionId: string | null = null;

  // The URL the user will be redirected to for next steps
  // If the ticket price is free, this will be their ticket URL
  // If the ticket is paid, this will be a checkout URL
  let url = `/events/${ticketPriceData.event.id}/tickets/${ticketId}`;

  if (!ticketPriceData.isFree && ticketPriceData.stripePriceId) {
    let promotionCodeDetails:
      | { promotionCodeId: string; couponId: string }
      | undefined = undefined;

    if (args.promotionCode) {
      const foundPromotionCode = await db.query.promotionCodes.findFirst({
        where: and(
          eq(promotionCodes.eventId, ticketPriceData.eventId),
          eq(promotionCodes.code, args.promotionCode)
        ),
        columns: {
          stripePromotionCodeId: true,
          stripeCouponId: true,
        },
      });

      if (
        foundPromotionCode?.stripePromotionCodeId &&
        foundPromotionCode?.stripeCouponId
      ) {
        promotionCodeDetails = {
          couponId: foundPromotionCode.stripeCouponId,
          promotionCodeId: foundPromotionCode.stripePromotionCodeId,
        };
      }
    }

    const checkout = await stripe.checkout.sessions.create({
      success_url: `${env.NEXT_PUBLIC_WEBSITE_URL}/events/${ticketPriceData.event.id}/tickets/${ticketId}`,
      line_items: [
        {
          quantity: 1,
          adjustable_quantity: { enabled: true, minimum: 1 },
          price: ticketPriceData.stripePriceId,
        },
      ],
      mode: "payment",
      // Only one of allow_promotion_codes and discounts is allowed. When one is defined, the other becomes undefined.
      allow_promotion_codes: promotionCodeDetails ? undefined : true,
      discounts: promotionCodeDetails
        ? [
            {
              promotion_code: promotionCodeDetails.promotionCodeId,
            },
          ]
        : undefined,
    });

    stripeSessionId = checkout.id;

    // If checkout.url is ever null, we have a problem
    if (checkout.url) {
      url = checkout.url;
    } else {
      throw new Error("Checkout URL was null");
    }
  }

  await db
    .insert(tickets)
    .values({
      id: ticketId,
      createdAt: new Date(),
      eventId: ticketPriceData.eventId,
      quantity: 1,
      updatedAt: new Date(),
      ticketPriceId: args.ticketPriceId,
      userId: args.userId,
      stripeSessionId,
      status: ticketPriceData.isFree ? "success" : "pending",
    })
    .returning()
    .get();

  return url;
};
