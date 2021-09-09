import { Button, Input } from "@components/FormComponents";
import Header from "@components/Header";
import Loading from "@components/Loading";
import { db } from "@config/firebase";
import EventDocument from "@typedefs/EventDocument";
import Link from "next/link";
import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Home() {

  const [query, setQuery] = useState("");

  const [events, eventsLoading] = useCollectionData<EventDocument>(db.collection("/events"), { idField: "id" });

  if (eventsLoading) return <Loading />;

  return (
    <div className="flex-1">
      <Header title="Home" />

      <h1 className="text-center">Events near University of Guelph</h1>
      <div className="mx-auto max-w-lg w-full p-2 sm:p-8">
        <div className="rounded-xl overflow-hidden mt-2 divide-y divide-y-gray-400 border border-gray-300">
          {events?.map((event) => <Link href={`/event/${event.id}`} key={event.id}>
            <div className="p-3 bg-white hover:bg-blue-500 hover:text-white transition cursor-pointer">
              <p>
                {event.title}
              </p>
            </div>
          </Link>
          )}
        </div>
      </div>
    </div >
  )
}
