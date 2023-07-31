import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";

export const metadata: Metadata = {
  title: getPageTitle("My Tickets"),
};

const Page = async () => {
  const userAuth = auth();
  const db = getDb();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const foundTickets = await db.query.tickets.findMany({
    where: and(
      eq(tickets.userId, userAuth.userId),
      eq(tickets.status, "success")
    ),
    columns: {
      quantity: true,
      slug: true,
      id: true,
    },
    with: {
      event: {
        columns: {
          id: true,
          slug: true,
          name: true,
          description: true,
          startTime: true,
        },
      },
    },
  });

  return (
    <div>
      {foundTickets.map((e) => (
        <Link
          href={`/events/${e.event.slug}/tickets/${e.slug}`}
          key={`ticket ${e.id}`}
        >
          <p>
            {e.quantity} tickets for {e.event.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Page;
