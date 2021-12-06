import Header from "@components/Header";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { query, collection, where, getFirestore, getDocs } from "@firebase/firestore";
import LoadingScreen from "@components/LoadingScreen";
import EventDocument from "@typedefs/EventDocument";

export default function Home() {
  const db = getFirestore();

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setEventsLoading(true);
      const eventsRef = query(collection(db, "/events"), where("visibility", "==", "public"));

      const eventDocs = await getDocs(eventsRef);
      const tmpEvents = [];
      eventDocs.forEach((doc: any) => {
        tmpEvents.push({ ...doc.data(), id: doc.id });
      });

      setEvents(tmpEvents);
      setEventsLoading(false);
    })();
  }, [])

  if (eventsLoading) return <LoadingScreen />;

  return (
    <div className="m-2 sm:m-8 flex-1">
      <Header title="Home" />

      <h2 className="text-center rainbow-text">Events Near University of Guelph</h2>
      <div className="mx-auto max-w-lg w-full p-2 sm:p-8">
        <div className="rounded-xl mt-2 flex flex-col gap-4">
          {events?.length > 0 ? events?.map((event: EventDocument) =>
            <Link href={`/event/${event.id}`} key={event.id}>
              <div className="p-3 bg-white dark:bg-gray-900 background-hover shadow-center-md rounded-xl">
                <h4>
                  {event.title}
                </h4>
                <p className="font-light text-sm text-right text-gray-dark:text-gray-300">
                  {event.eventDate.toDate().toDateString()}
                </p>
              </div>
            </Link>
          ) : <p className="p-3 text-center text-lg text-gray-600 dark:text-gray-300">No events</p>}
        </div>
      </div>
    </div >
  )
}
