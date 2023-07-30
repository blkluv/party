"use client";

import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { env } from "~/config/env";
import { trpc } from "~/utils/trpc";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
      })
  );
  const auth = useAuth();

  // Use Vercel URL if present
  const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/trpc`;

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => process.env.NODE_ENV === "development",
        }),
        httpBatchLink({
          url,
          fetch: async (url, options) => {
            const headers = new Headers(options?.headers);

            if (options?.method === "OPTIONS") {
              const t = await auth.getToken();
              if (t) {
                headers.set("Authorization", t);
              }
            }

            return await fetch(url, {
              ...options,
              headers,
              cache: "no-store",
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
