"use client";

import type { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { trpc } from "~/utils/trpc";
import type { AppRouter } from "../api/trpc/trpc-router";
import { ClientDate } from "./ClientDate";
import { LoadingSpinner } from "./LoadingSpinner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const SearchEvents = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 100);
  const { data = [], isFetching } = trpc.events.searchEvents.useQuery({
    query: debouncedQuery,
  });

  return (
    <div>
      <div className="space-y-0.5">
        <Label>Search</Label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for events"
        />
      </div>
      <div className="flex flex-col mt-4">
        {data.map((e) => (
          <EventListing data={e} key={e.id} />
        ))}
        {isFetching && data.length === 0 && (
          <LoadingSpinner className="mx-auto mt-4" size={25} />
        )}
      </div>
    </div>
  );
};

const EventListing: FC<{
  data: inferProcedureOutput<AppRouter["events"]["searchEvents"]>[number];
}> = (props) => {
  return (
    <Link
      className="p-2 flex gap-2 sm:gap-8 items-center rounded-3xl hover:bg-neutral-800 transition duration-75"
      href={`/events/${props.data.id}`}
    >
      <div className="w-24 h-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0">
        <Image
          src={props.data.imageUrl}
          alt=""
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <p className="font-semibold truncate sm:text-lg">{props.data.name}</p>
        <p className="text-sm text-neutral-200">
          <ClientDate date={props.data.startTime} />
        </p>
      </div>
    </Link>
  );
};
