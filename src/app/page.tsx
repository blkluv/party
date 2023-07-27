import { getPublicEvents } from "~/utils/getEvents";
import { EventsList } from "./_components/events-list";

export const dynamic = true;

const Page = async () => {
  const foundEvents = await getPublicEvents();

  return (
    <div>
      <EventsList events={foundEvents} />
    </div>
  );
};

export default Page;
