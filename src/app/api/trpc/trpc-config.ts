import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { events } from "~/db/schema";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      isPlatformAdmin: await isUserPlatformAdmin(),
      auth: ctx.auth,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;

// export this procedure to be used anywhere in your application
export const protectedProcedure = t.procedure.use(isAuthed);
export const protectedEventProcedure = protectedProcedure
  .input(z.object({ eventId: z.number() }))
  .use(({ ctx, next, input }) => {
    const event = ctx.db.query.events.findFirst({
      where: eq(events.id, input.eventId),
    });

    if (!event) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not authorized to perform this operation",
      });
    }
    return next({ ctx });
  });
