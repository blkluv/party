import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import QRCode from "react-qr-code";
import { z } from "zod";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import { getStripeClient } from "~/utils/stripe";
import { publicUserMetadataSchema } from "~/utils/userMetadataSchema";
import { TicketInfoButton } from "./ticket-helpers";

const paymentValidationSchema = z
  .object({ status: z.literal("succeeded") })
  .strip();

const Page = async (props: { params: { ticketSlug: string } }) => {
  const db = getDb();
  const stripe = getStripeClient();
  const userAuth = auth();

  if (!userAuth.userId) {
    return <div>User not logged in</div>;
  }

  const user = await clerkClient.users.getUser(userAuth.userId);

  const publicMetadata = publicUserMetadataSchema.safeParse(
    user.publicMetadata
  );

  // If the user is an admin, they are always allowed to view tickets
  // If not, the user needs to own the ticket
  let isAdmin = false;
  if (publicMetadata.success && publicMetadata.data.platformRole === "admin") {
    isAdmin = true;
  }

  const ticketData = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.slug, props.params.ticketSlug),
      isAdmin ? undefined : eq(tickets.userId, userAuth.userId)
    ),
    with: {
      price: true,
      event: true,
    },
  });

  if (!ticketData || !ticketData.stripeSessionId) {
    return <div>Could not find ticket</div>;
  }

  const session = await stripe.checkout.sessions.retrieve(
    ticketData.stripeSessionId,
    {
      expand: ["payment_intent"],
    }
  );

  // Update status of ticket if pending
  if (ticketData.status === "pending" && ticketData.price.isFree === false) {
    const paymentIntentStatus = paymentValidationSchema.safeParse(
      session.payment_intent
    );
    if (paymentIntentStatus.success) {
      await db.update(tickets).set({ status: "success" }).run();
      ticketData.status = "success";
    }
  }

  return (
    <div className="flex justify-center items-center flex-1 p-2">
      <div className="relative">
        <div className="w-48 h-48 z-0 bg-green-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
        <div className="w-48 h-48 z-0 bg-red-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[25%%] -translate-y-1/2" />
        <div className="w-48 h-48 z-0 bg-blue-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[75%] -translate-y-1/2" />
        <div className="border rounded-lg bg-white/50  relative z-10 px-8 pt-8 space-y-4">
          <QRCode
            value={`${
              env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_WEBSITE_URL
            }/events/${ticketData.event.slug}/tickets/${ticketData.slug}`}
            className="shadow-md border border-gray-300"
          />
          <h1 className="font-bold text-center text-lg">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-center font-medium">
            x{ticketData.quantity} Ticket
            {ticketData.quantity > 1 ? "s" : ""} for {ticketData.event.name}
          </p>
          <div className="flex justify-center border-t">
            <TicketInfoButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
