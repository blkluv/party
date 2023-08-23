import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "~/db/client";
import { events } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { ManagePromotionCodes } from "../manage/event-management-helpers";

type PageProps = { params: { eventId: string } };

export const dynamic = "force-dynamic";

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
    where: and(eq(events.id, props.params.eventId)),
  });

  if (!event) {
    redirect(`/events/${props.params.eventId}`);
  }

  const userEventRole = await getUserEventRole(props.params.eventId);

  if (userEventRole !== "admin") {
    redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="max-w-2xl w-full my-8 px-2 mx-auto">
      <ManagePromotionCodes eventId={props.params.eventId} />
    </div>
  );
};

export default Page;
