import { auth } from "@clerk/nextjs";
import { and, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "~/db/client";
import { eventRoles, events } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
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
    with: {
      roles: {
        where: and(
          eq(eventRoles.userId, userAuth.userId),
          inArray(eventRoles.role, ["admin", "manager"])
        ),
      },
    },
  });

  if (!event) {
    redirect(`/events/${props.params.eventId}`);
  }

  const userEventRole =
    event.userId === userAuth.userId ? "admin" : event?.roles[0]?.role;

  if (!userEventRole) {
    redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="max-w-2xl w-full my-8 px-2 mx-auto">
      <ManagePromotionCodes
        eventId={props.params.eventId}
        // role={userEventRole}
      />
    </div>
  );
};

export default Page;
