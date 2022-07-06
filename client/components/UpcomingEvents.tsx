import axios from "axios";
import { useEffect, useState } from "react";
import PartyBoxEvent from "~/types/PartyBoxEvent";
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
    <div className="flex flex-col gap-4">
      {events.length === 0 && !eventsLoading && <p className="text-center">No events</p>}
      {events.map((event) => (
        <EventPreview event={event} key={`event-${event.id}`} />
      ))}
      {eventsLoading && <LoadingIcon className="animate-spin mx-auto" size={50} />}
    </div>
  );
};

export default UpcomingEvents;
