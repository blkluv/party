import { auth } from "@clerk/nextjs";
import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDb } from "~/db/client";
import { getStripeClient } from "~/utils/stripe";

export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  return {
    auth: auth(),
    db: getDb(),
    stripe: getStripeClient(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
