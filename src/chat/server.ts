import { createClient } from "@libsql/client/web";
import { createId } from "@paralleldrive/cuid2";
import { MultiRegionRatelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createLocalJWKSet, jwtVerify } from "jose";
import type { PartyKitRoom, PartyKitServer } from "partykit/server";
import { z } from "zod";
import type { ChatErrorEvent, InitialMessagesEvent } from "~/utils/chat";
import { socketEventSchema } from "~/utils/chat";
import * as schema from "../db/schema";

const cache = new Map();

const getRateLimiter = (args: { url: string; token: string }) => {
  return new MultiRegionRatelimit({
    redis: [new Redis(args)],
    limiter: MultiRegionRatelimit.slidingWindow(10, "10 s"),
    analytics: true,
    ephemeralCache: cache,
  });
};

const getDb = (args: { url: string; authToken: string }) => {
  const libsqlClient = createClient(args);

  return drizzle(libsqlClient, { schema });
};

const getEnv = (room: PartyKitRoom) => {
  const env = z
    .object({
      OPENAI_API_KEY: z.string(),
      DATABASE_URL: z.string(),
      DATABASE_AUTH_TOKEN: z.string(),
      UPSTASH_REDIS_URL: z.string(),
      UPSTASH_REDIS_TOKEN: z.string(),
      CLERK_PUBLISHABLE_KEY: z.string(),
      CLERK_SECRET_KEY: z.string(),
    })
    .safeParse({
      OPENAI_API_KEY: room.env.OPENAI_API_KEY,
      UPSTASH_REDIS_TOKEN: room.env.UPSTASH_REDIS_TOKEN,
      UPSTASH_REDIS_URL: room.env.UPSTASH_REDIS_URL,
      DATABASE_URL: room.env.DATABASE_URL,
      DATABASE_AUTH_TOKEN: room.env.DATABASE_AUTH_TOKEN,
      CLERK_PUBLISHABLE_KEY: room.env.CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: room.env.CLERK_SECRET_KEY,
    });

  return env;
};

const server: PartyKitServer = {
  onConnect: async (ws, room, ctx) => {
    const { searchParams } = new URL(ctx.request.url);
    const token = searchParams.get("authorization");

    const env = getEnv(room);

    if (!env.success) {
      console.log(env.error.message);
      return;
    }

    if (!token) {
      console.log("Missing auth token");
      return;
    }
    let userId = "";

    try {
      const headers = new Headers();
      headers.set("authorization", `Bearer ${env.data.CLERK_SECRET_KEY}`);

      const data = await fetch("https://api.clerk.com/v1/jwks", {
        headers,
      }).then((res) => res.json());

      const jwks = createLocalJWKSet(data);
      const res = await jwtVerify(token, jwks);

      if (res.payload.sub) {
        userId = res.payload.sub;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      const errorEvent: ChatErrorEvent = {
        __type: "ERROR",
        data: {
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this chat room",
        },
      };

      ws.send(JSON.stringify(errorEvent));
      return;
    }

    const db = getDb({
      authToken: env.data.DATABASE_AUTH_TOKEN,
      url: env.data.DATABASE_URL,
    });

    const messages = await db.query.chatMessages.findMany({
      where: eq(schema.chatMessages.eventId, room.id),
      orderBy: desc(schema.chatMessages.createdAt),
      limit: 50,
    });

    const eventData = await db.query.events.findFirst({
      where: eq(schema.events.id, room.id),
    });

    if (!eventData) {
      return;
    }

    if (eventData.type === "event") {
      const ticketData = await db.query.tickets.findFirst({
        where: eq(schema.tickets.userId, userId),
      });

      if (!ticketData) {
        return;
      }
    }

    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const event: InitialMessagesEvent = {
      __type: "INITIAL_MESSAGES",
      data: {
        messages: messages.map((e) => ({ __type: "CHAT_MESSAGE", data: e })),
      },
    };

    ws.send(JSON.stringify(event));
  },
  onMessage: async (event, ws, room) => {
    const env = getEnv(room);

    if (!env.success) {
      console.log(env.error.message);
      return;
    }

    if (typeof event === "string") {
      const validatedMessage = socketEventSchema.safeParse(JSON.parse(event));

      if (!validatedMessage.success) {
        console.log(validatedMessage.error.message);
        return;
      } else if (validatedMessage.data.__type === "CHAT_MESSAGE") {
        const ratelimit = getRateLimiter({
          url: env.data.UPSTASH_REDIS_URL,
          token: env.data.UPSTASH_REDIS_TOKEN,
        });
        const { success } = await ratelimit.limit(
          validatedMessage.data.data.userId
        );

        if (!success) {
          console.error(
            `Rate limited user ${validatedMessage.data.data.userId}`
          );
          const errorEvent: ChatErrorEvent = {
            __type: "ERROR",
            data: {
              code: "TOO_MANY_MESSAGES",
              message: "You've sent too many messages too quickly. Slow down.",
            },
          };

          ws.send(JSON.stringify(errorEvent));

          return;
        }

        const db = getDb({
          authToken: env.data.DATABASE_AUTH_TOKEN,
          url: env.data.DATABASE_URL,
        });

        await db
          .insert(schema.chatMessages)
          .values({ ...validatedMessage.data.data, id: createId() })
          .returning()
          .get();
      }

      room.broadcast(event);
    }
  },
};

export default server;
