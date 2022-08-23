import axios from "axios";
import { PartyBoxEvent } from "@party-box/common";
import EventPreview from "./EventPreview";
import { LoadingIcon } from "./Icons";
import { useQuery } from "react-query";

const UpcomingEvents = () => {
  const { data: events = [], isLoading: eventsLoading } = useQuery("upcomingEvents", async () => {
    const { data } = await axios.get<PartyBoxEvent[]>("/api/events/upcoming");
    return data;
  });

  return (
    <>
      {events.length === 0 && !eventsLoading && <p className="text-center text-xl">No events</p>}
      {events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {events.map((event) => (
            <EventPreview event={event} key={`event-${event.id}`} />
          ))}
        </div>
      )}
      {eventsLoading && <LoadingIcon className="animate-spin mx-auto" size={50} />}
    </>
  );
};

export default UpcomingEvents;
