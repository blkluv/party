import { auth, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { env } from "~/config/env";
import { getDb } from "~/db/client";
import { eventMedia, events, tickets } from "~/db/schema";
import { isChatVisible, isLocationVisible } from "~/utils/event-time-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { ChatRoom } from "./chat-room";

export const dynamic = "force-dynamic";

type PageProps = { params: { eventId: string } };
const getEventData = cache(async (eventId: string) => {
  const db = getDb();
  const eventData = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: {
      capacity: true,
      startTime: true,
      name: true,
      hideLocation: true,
      location: true,
      type: true,
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

  const title = getPageTitle(`Conversation for ${eventData.name}`);
  const description = `This is a conversation about ${eventData.name}`;

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

  const db = getDb();

  const [eventData, eventRole] = await Promise.all([
    getEventData(props.params.eventId),
    getUserEventRole(props.params.eventId),
  ]);

  if (!eventData || !isChatVisible(eventData.startTime)) {
    redirect("/");
  }

  if (eventData.type === "event" && eventRole !== "admin") {
    const ticketData = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.eventId, props.params.eventId),
        eq(tickets.userId, user.id),
        eq(tickets.status, "success")
      ),
    });

    if (!ticketData) {
      redirect(`/events/${props.params.eventId}`);
    }
  }

  const showLocation = isLocationVisible(
    eventData.startTime,
    eventData.hideLocation
  );

  return (
    <ChatRoom
      eventId={props.params.eventId}
      eventName={eventData.name}
      eventLocation={showLocation ? eventData.location : null}
      startTime={eventData.startTime}
      role={eventRole}
      authToken={token ?? ""}
    />
  );
};

export default Page;
