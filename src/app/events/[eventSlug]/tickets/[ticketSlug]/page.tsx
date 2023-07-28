import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import QRCode from "react-qr-code";
import { z } from "zod";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import { getStripeClient } from "~/utils/stripe";

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

  const ticketData = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.slug, props.params.ticketSlug),
      eq(tickets.userId, userAuth.userId)
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
        <div className="w-48 h-48 z-0 bg-pink-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[75%] -translate-y-0" />
        <div className="w-48 h-48 z-0 bg-blue-500 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-[25%] -translate-y-0" />
        <div className="border rounded-lg bg-white/50 backdrop-blur relative z-10 p-4 sm:p-8 space-y-4">
          <QRCode
            value="http://localhost:3000"
            className="shadow-md border border-gray-300"
          />
          <h1 className="font-bold text-center text-lg">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-center font-medium">
            x{ticketData.quantity} Ticket
            {ticketData.quantity > 1 ? "s" : ""} for {ticketData.event.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
