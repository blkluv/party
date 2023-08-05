import { auth } from "@clerk/nextjs";
import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EditEventForm } from "~/app/_components/event-form-variants";
import { getDb } from "~/db/client";
import { events } from "~/db/schema";

type PageProps = { params: { eventId: string } };
const Page = async (props: PageProps) => {
  const db = getDb();
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const eventData = await db.query.events.findFirst({
    where: and(
      eq(events.id, props.params.eventId),
      eq(events.userId, userAuth.userId)
    ),
    with: {
      eventMedia: true,
      coupons: true,
      ticketPrices: true,
      tickets: true,
    },
  });

  if (!eventData) {
    redirect("/");
  }

  return (
    <div className="mx-2 sm:mx-auto sm:w-full max-w-lg my-8">
      <EditEventForm
        eventId={props.params.eventId}
        initialValues={{
          ...eventData,
          startDate: new Date(eventData.startTime),
          startTime: dayjs(eventData.startTime).format("HH:mm"),
          eventMedia: eventData.eventMedia.map((e) => ({
            __type: "url",
            id: e.id,
            url: e.url,
            isPoster: e.isPoster,
          })),
        }}
      />
    </div>
  );
};

export default Page;
