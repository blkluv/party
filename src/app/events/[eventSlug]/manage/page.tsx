import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "~/db/client";
import { events } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { ManagementContainer } from "./event-management-helpers";

type PageProps = { params: { eventSlug: string } };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Manage Event"),
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

  return (
    <div className="mx-auto max-w-2xl w-full my-8">
      <ManagementContainer eventId={event.id} />
    </div>
  );
};

export default Page;
