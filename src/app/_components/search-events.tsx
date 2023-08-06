"use client";

import type { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
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
    <div className="py-2 flex gap-2 items-center">
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
        <Image
          src={props.data.imageUrl}
          alt=""
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <p className="font-semibold truncate">{props.data.name}</p>
        <p className="text-sm text-neutral-200">
          <ClientDate date={props.data.startTime} />
        </p>
      </div>
    </div>
  );
};
