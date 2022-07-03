import axios from "axios";
import { useEffect, useState } from "react";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import EventPreview from "./EventPreview";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<PartyBoxEvent[]>([]);
  const getUpcomingEvents = async () => {
    try {
      const { data } = await axios.get("/api/events/upcoming");
      console.log(data);
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(events);
  
  useEffect(() => {
    getUpcomingEvents();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventPreview event={event} key={`event-${ event.id}`} />
      ))}
    </div>
  );
};

export default UpcomingEvents;
