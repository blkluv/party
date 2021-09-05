import { Input } from "@components/FormComponents";
import Head from "@components/Head";
import { db } from "@config/firebase";
import Link from "next/link";
import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Home() {

  const [query, setQuery] = useState("");

  const [locations] = useCollectionData(db.collection("/locations"), { idField: "id" })
  const filteredSchools = locations?.length ? locations.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase())) : ["None"];

  return (
    <div className="flex-1">
      <Head title="Home" />

      <div className="bg-gray-50 py-64">
        <div className="mx-auto max-w-3xl w-screen rounded-xl p-4 sm:p-8">
          <p>School Name</p>
          <Input value={query} onChange={(e: any) => setQuery(e.target.value)} type="text" />

          <div className="rounded-xl overflow-hidden mt-2 divide-y divide-y-gray-400 mx-auto max-w-sm">
            {filteredSchools.map((school) => <Link href={`/location/${school.id}`} key={school.name}>
              <div className="p-2 bg-white hover:bg-blue-500 hover:text-white transition cursor-pointer">
                <p>
                  {school.name}
                </p>
              </div>
            </Link>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}
