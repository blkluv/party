import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextResponse } from "next/server";
import { createContext } from "../context";
import { appRouter } from "../trpc-router";

export const dynamic = "force-dynamic";
// export const runtime = "edge";

const handler = (request: Request) => {
  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { status: 200 });
  }
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(opts);
    },
  });
};

export { handler as GET, handler as OPTIONS, handler as POST };
