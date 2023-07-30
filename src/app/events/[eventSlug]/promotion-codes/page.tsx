import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "~/db/client";
import { events, promotionCodes } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";

type PageProps = { params: { eventSlug: string } };

export const metadata: Metadata = {
  title: getPageTitle("Promotion Codes"),
};

const Page = async (props: PageProps) => {
  const db = getDb();
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const event = await db.query.events.findFirst({
    where: and(
      eq(events.slug, props.params.eventSlug),
      eq(events.userId, userAuth.userId)
    ),
  });

  if (!event) {
    redirect("/");
  }

  const codes = await db.query.promotionCodes.findMany({
    where: eq(promotionCodes.eventId, event.id),
  });

  return <div></div>;
};

export default Page;
