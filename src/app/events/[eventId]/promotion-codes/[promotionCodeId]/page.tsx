import { auth } from "@clerk/nextjs";
import { Card, Metric, Text } from "@tremor/react";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { getDb } from "~/db/client";
import { promotionCodes, tickets } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { TicketPerformanceChart } from "./promotion-code-components";

type PageProps = { params: { eventId: string; promotionCodeId: string } };
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Promotion Code Performance"),
};

const Page = async (props: PageProps) => {
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("sign-in");
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-2 py-8 flex flex-col gap-8">
      <Suspense fallback={<LoadingSpinner size={50} className="mx-auto" />}>
        <PromotionCodePerformanceView
          eventId={props.params.eventId}
          promotionCodeId={props.params.promotionCodeId}
        />
      </Suspense>
    </div>
  );
};

const PromotionCodePerformanceView = async (props: {
  eventId: string;
  promotionCodeId: string;
}) => {
  const eventRole = await getUserEventRole(props.eventId);

  if (eventRole !== "admin") {
    redirect(`/events/${props.eventId}`);
  }

  const db = getDb();
  const foundPromotionCode = await db.query.promotionCodes.findFirst({
    where: eq(promotionCodes.id, props.promotionCodeId),
    with: {
      tickets: {
        where: eq(tickets.status, "success"),
        columns: {
          createdAt: true,
          id: true,
          quantity: true,
          userId: true,
        },
        with: {
          price: true,
        },
      },
    },
  });

  if (!foundPromotionCode) {
    redirect(`/events/${props.eventId}`);
  }

  const totalRevenue = foundPromotionCode.tickets.reduce(
    (sum, current) => sum + current.price.price * current.quantity,
    0
  );
  const ticketsSold = foundPromotionCode.tickets.reduce(
    (sum, current) => sum + current.quantity,
    0
  );

  return (
    <div className="mx-auto w-full max-w-2xl p-2 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-center">
          Promotion Code Performance
        </h1>
        <div className="bg-neutral-800 text-sm font-semibold mx-auto text-center px-4 py-1 rounded-full">
          <p>{foundPromotionCode.code}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <Text>Tickets Sold</Text>
          <Metric>{ticketsSold}</Metric>
        </Card>
        <Card>
          <Text>Total Revenue</Text>
          <Metric>${totalRevenue.toFixed(2)}</Metric>
        </Card>
      </div>
      <TicketPerformanceChart data={foundPromotionCode.tickets} />
    </div>
  );
};

export default Page;
