import Header from "@components/Header";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { query, collection, where, getFirestore, getDocs } from "@firebase/firestore";
import LoadingScreen from "@components/LoadingScreen";

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

      <h1 className="text-center font-light text-xl">Events near University of Guelph</h1>
      <div className="mx-auto max-w-lg w-full p-2 sm:p-8">
        <div className="rounded-xl overflow-hidden mt-2 divide-y divide-y-gray-400 border border-gray-300">
          {events?.length > 0 ? events?.map((event) => <Link href={`/event/${event.id}`} key={event.id}>
            <div className="p-3 bg-white hover:bg-blue-500 hover:text-white transition cursor-pointer group">
              <p>
                {event.title}
              </p>
              <p className="font-light text-sm text-right text-gray-500 group-hover:text-white">
                {event.eventDate.toDate().toDateString()}
              </p>
            </div>
          </Link>
          ) : <p className="p-3">No events</p>}
        </div>
      </div>
    </div >
  )
}
