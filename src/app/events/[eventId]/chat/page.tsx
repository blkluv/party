import { auth } from "@clerk/nextjs";
import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SHOW_CHAT_HOURS_THRESHOLD } from "~/config/constants";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import { isEventOver } from "~/utils/event-time-helpers";
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

  const ticketData = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.eventId, props.params.eventId),
      eq(tickets.userId, userAuth.userId),
      eq(tickets.status, "success")
    ),
    with: {
      event: {
        columns: {
          name: true,
          startTime: true,
        },
      },
    },
  });
  if (!ticketData) {
    redirect("/");
  }

  if (
    isEventOver(ticketData.event.startTime) ||
    dayjs()
      .add(SHOW_CHAT_HOURS_THRESHOLD, "hour")
      .isBefore(ticketData.event.startTime)
  ) {
    redirect("/");
  }

  return (
    <ChatRoom
      eventId={props.params.eventId}
      eventName={ticketData.event.name}
      startTime={ticketData.event.startTime}
    />
  );
};

export default Page;
