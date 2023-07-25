import { auth } from "@clerk/nextjs";
import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  return { auth: auth() };
};

export type Context = inferAsyncReturnType<typeof createContext>;
