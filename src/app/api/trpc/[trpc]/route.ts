import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "../context";
import { appRouter } from "../trpc-router";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(opts);
    },
  });
};

export { handler as GET, handler as POST };
