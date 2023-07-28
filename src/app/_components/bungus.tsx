"use client";

import { trpc } from "~/utils/trpc";

export const Bungus = () => {
  const { data } = trpc.auth.getUser.useQuery();
  return (
    <div className="mx-auto w-full max-w-sm whitespace-pre">
      {JSON.stringify(data, null, 2)}
    </div>
  );
};
