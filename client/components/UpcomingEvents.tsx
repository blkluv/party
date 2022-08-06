import axios from "axios";
import { useEffect, useState } from "react";
import { PartyBoxEvent } from "@party-box/common";
import EventPreview from "./EventPreview";
import { LoadingIcon } from "./Icons";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<PartyBoxEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const getUpcomingEvents = async () => {
    try {
      setEventsLoading(true);
      const { data } = await axios.get("/api/events/upcoming");
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    getUpcomingEvents();
  }, []);

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
