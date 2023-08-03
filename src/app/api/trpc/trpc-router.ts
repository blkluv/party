import { z } from "zod";
import { isTextSafe } from "~/utils/isTextSafe";
import { authRouter } from "../auth-router";
import { eventsRouter } from "../events-router";
import { protectedProcedure, router } from "./trpc-config";

export const appRouter = router({
  auth: authRouter,
  events: eventsRouter,
  isTextSafe: protectedProcedure
    .input(z.object({ message: z.string() }))
    .query(async ({ input }) => {
      return await isTextSafe(input.message);
    }),
});

export type AppRouter = typeof appRouter;
