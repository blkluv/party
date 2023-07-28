"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import { useMemo, useState } from "react";
import superjson from "superjson";
import { env } from "~/config/env";
import { trpc } from "~/utils/trpc";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
      }),
    []
  );

  const url = env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000/api/trpc/";

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
      transformer: superjson,
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
