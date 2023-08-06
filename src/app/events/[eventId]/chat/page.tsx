import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { events, tickets } from "~/db/schema";
import { isChatVisible } from "~/utils/event-time-helpers";
import { ChatRoom } from "./chat-room";

type PageProps = { params: { eventId: string } };

/**
 * Chat room for ticket holders that opens a few hours before the event and closes when the event is done
 */
const Page = async (props: PageProps) => {
  const userAuth = auth();

  if (!env.NEXT_PUBLIC_FEATURE_CHAT_MESSAGES || !userAuth.userId) {
    redirect(`/events/${props.params.eventId}`);
  }

  const db = getDb();

  const eventData = await db.query.events.findFirst({
    where: eq(events.id, props.params.eventId),
    columns: {
      capacity: true,
      startTime: true,
      name: true,
    },
  });

  if (!eventData || !isChatVisible(eventData.startTime)) {
    redirect("/");
  }

  if (eventData.capacity > 0) {
    const ticketData = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.eventId, props.params.eventId),
        eq(tickets.userId, userAuth.userId),
        eq(tickets.status, "success")
      ),
    });

    if (!ticketData) {
      redirect("/");
    }
  }

  return (
    <ChatRoom
      eventId={props.params.eventId}
      eventName={eventData.name}
      startTime={eventData.startTime}
    />
  );
};

export default Page;