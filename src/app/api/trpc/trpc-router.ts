import { authRouter } from "../auth-router";
import { eventsRouter } from "../events-router";
import { router, t } from "./trpc-config";

export const appRouter = router({
  ping: t.procedure.query(() => {
    return "hellgggo";
  }),
  auth: authRouter,
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;
