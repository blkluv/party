import { auth, clerkClient } from "@clerk/nextjs";
import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import QRCode from "react-qr-code";
import { z } from "zod";
import { SHOW_LOCATION_HOURS_THRESHOLD } from "~/config/constants";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import { getStripeClient } from "~/utils/stripe";
import { LocationDialog, TicketInfoButton } from "./ticket-helpers";

export const dynamic = "force-dynamic";

const paymentValidationSchema = z
  .object({ status: z.literal("succeeded") })
  .strip();

const Page = async (props: { params: { ticketSlug: string } }) => {
  const db = getDb();
  const stripe = getStripeClient();
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const user = await clerkClient.users.getUser(userAuth.userId);
  const isAdmin = await isUserPlatformAdmin();

  const ticketData = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.slug, props.params.ticketSlug),
      // If the user is an admin, they are always allowed to view tickets
      // If not, the user needs to own the ticket
      isAdmin ? undefined : eq(tickets.userId, userAuth.userId)
    ),
    with: {
      price: true,
      event: true,
    },
  });

  if (!ticketData || !ticketData.stripeSessionId) {
    redirect("/");
  }

  // Update status of ticket if pending
  if (ticketData.status === "pending" && ticketData.price.isFree === false) {
    const session = await stripe.checkout.sessions.retrieve(
      ticketData.stripeSessionId,
      {
        expand: ["payment_intent"],
      }
    );

    const paymentIntentStatus = paymentValidationSchema.safeParse(
      session.payment_intent
    );

    const ticketLineItem = session.line_items?.data[0];

    if (paymentIntentStatus.success && ticketLineItem?.quantity) {
      await db
        .update(tickets)
        .set({ status: "success", quantity: ticketLineItem.quantity })
        .run();

      ticketData.quantity = ticketLineItem.quantity;
      ticketData.status = "success";
    }
  }

  const showLocation =
    dayjs(ticketData.event.startTime).diff(new Date(), "hour") <=
    SHOW_LOCATION_HOURS_THRESHOLD;

  return (
    <div className="flex justify-center items-center flex-1 p-2">
      <div className="relative">
        <div className="w-48 h-48 z-0 bg-green-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
        <div className="w-48 h-48 z-0 bg-red-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[25%%] -translate-y-1/2" />
        <div className="w-48 h-48 z-0 bg-blue-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[75%] -translate-y-1/2" />
        <div className="border rounded-lg bg-neutral-900/50 relative z-10 px-8 pt-8 flex flex-col gap-4">
          <p className="text-sm text-center font-medium">
            Event #{ticketData.eventId}
          </p>
          <QRCode
            value={`${env.NEXT_PUBLIC_WEBSITE_URL}/events/${ticketData.event.slug}/tickets/${ticketData.slug}`}
            className="shadow-md border border-gray-300"
          />
          <h1 className="font-bold text-center text-lg">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-center font-medium">
            {`${ticketData.quantity} ticket${
              ticketData.quantity > 1 ? "s" : ""
            } for ${ticketData.event.name}`}
          </p>
          <div className="flex justify-evenly gap-2 border-t border-neutral-800">
            <TicketInfoButton />
            {!showLocation && (
              <LocationDialog location={ticketData.event.location} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
