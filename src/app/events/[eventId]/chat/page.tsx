import { auth, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { eventMedia, events, tickets } from "~/db/schema";
import { isChatVisible } from "~/utils/event-time-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import { ChatRoom } from "./chat-room";

type PageProps = { params: { eventId: string } };
const getEventData = cache(async (eventId: string) => {
  const db = getDb();
  const eventData = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: {
      capacity: true,
      startTime: true,
      name: true,
    },
    with: {
      eventMedia: {
        where: eq(eventMedia.isPoster, true),
      },
    },
  });

  return eventData;
});

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const eventData = await getEventData(props.params.eventId);

  if (!eventData) {
    return {};
  }

  const poster = eventData.eventMedia[0];

  const images: NonNullable<Metadata["openGraph"]>["images"] = [];

  if (poster) {
    images.push({ url: poster.url, width: 1200, height: 630 });
  }

  const title = getPageTitle(`Discussion for ${eventData.name}`);
  const description = `This is a chat room to discuss ${eventData.name}`;

  return {
    title,
    description,
    openGraph: {
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      images,
      title,
      description,
    },
  };
};
/**
 * Chat room for ticket holders that opens a few hours before the event and closes when the event is done
 */
const Page = async (props: PageProps) => {
  const user = await currentUser();

  const token = await auth().getToken();

  if (!user) {
    redirect("/sign-in");
  }

  if (!env.NEXT_PUBLIC_FEATURE_CHAT_MESSAGES) {
    redirect(`/events/${props.params.eventId}`);
  }

  const db = getDb();

  const [eventData, admin] = await Promise.all([
    getEventData(props.params.eventId),
    isUserPlatformAdmin(user),
  ]);

  if (!eventData || !isChatVisible(eventData.startTime)) {
    redirect("/");
  }

  if (eventData.capacity > 0) {
    const ticketData = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.eventId, props.params.eventId),
        eq(tickets.userId, user.id),
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
      isUserPlatformAdmin={admin}
      authToken={token ?? ""}
    />
  );
};

export default Page;
