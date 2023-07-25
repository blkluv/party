import { cache } from "react";
import { getPublicEvents } from "~/utils/getEvents";
import { EventsList } from "./_components/events-list";

export const dynamic = true;

const getEvents = cache(getPublicEvents);

const Page = async () => {
  const foundEvents = await getEvents();

  return (
    <div>
      <EventsList events={foundEvents} />
    </div>
  );
};

export default Page;
