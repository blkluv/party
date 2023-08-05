"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { trpc } from "~/utils/trpc";
import { Input } from "./ui/input";

export const SearchEvents = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 50);
  const { data } = trpc.events.searchEvents.useQuery({ query: debouncedQuery });

  return (
    <div>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
