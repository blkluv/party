import { auth } from "@clerk/nextjs";
import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDb } from "~/db/client";

export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  return { auth: auth(), db: getDb() };
};

export type Context = inferAsyncReturnType<typeof createContext>;
