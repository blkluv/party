import { authRouter } from "../auth-router";
import { eventsRouter } from "../events-router";
import { router } from "./trpc-config";

export const appRouter = router({
  auth: authRouter,
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;
