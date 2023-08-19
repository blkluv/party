import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "~/db/client";
import { ticketPrices } from "~/db/schema";
import { createTicketPurchaseUrl } from "~/utils/createTicketPurchaseUrl";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: { eventId: string; ticketPriceId: string };
};

export const GET = async (req: Request, props: RouteProps) => {
  const userAuth = auth();

  if (!userAuth.userId) {
    return NextResponse.redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);

  try {
    const url = await createTicketPurchaseUrl({
      ticketPriceId: props.params.ticketPriceId,
      userId: userAuth.userId,
      promotionCode: searchParams.get("code") ?? undefined,
    });

    return NextResponse.redirect(url);
  } catch (error) {
    const db = getDb();
    // Redirect to event page in case of error
    const ticketPrice = await db.query.ticketPrices.findFirst({
      where: eq(ticketPrices.id, props.params.ticketPriceId),
      columns: {
        eventId: true,
      },
    });

    if (ticketPrice?.eventId) {
      return NextResponse.redirect(`/events/${ticketPrice.eventId}`);
    }

    return NextResponse.redirect("/");
  }
};
