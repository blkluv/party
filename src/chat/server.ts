import { createClient } from "@libsql/client/web";
import { createId } from "@paralleldrive/cuid2";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type { PartyKitRoom, PartyKitServer } from "partykit/server";
import { z } from "zod";
import type { InitialMessagesEvent } from "~/utils/chat";
import { socketEventSchema } from "~/utils/chat";
import * as schema from "../db/schema";

const getRateLimiter = (args: { url: string; token: string }) =>
  new Ratelimit({
    redis: new Redis(args),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
  });

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
    })
    .safeParse({
      OPENAI_API_KEY: room.env.OPENAI_API_KEY,
      UPSTASH_REDIS_TOKEN: room.env.UPSTASH_REDIS_TOKEN,
      UPSTASH_REDIS_URL: room.env.UPSTASH_REDIS_URL,
      DATABASE_URL: room.env.DATABASE_URL,
      DATABASE_AUTH_TOKEN: room.env.DATABASE_AUTH_TOKEN,
    });

  return env;
};

const server: PartyKitServer = {
  onConnect: async (ws, room) => {
    const env = getEnv(room);

    if (!env.success) {
      console.log(env.error.message);
      return;
    }

    const db = getDb({
      authToken: env.data.DATABASE_AUTH_TOKEN,
      url: env.data.DATABASE_URL,
    });

    const messages = await db.query.chatMessages.findMany({
      where: eq(schema.chatMessages.eventId, room.id),
      orderBy: asc(schema.chatMessages.createdAt),
    });

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
      console.log(event);
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
          return;
        }

        const db = getDb({
          authToken: env.data.DATABASE_AUTH_TOKEN,
          url: env.data.DATABASE_URL,
        });

        await db
          .insert(schema.chatMessages)
          .values({ ...validatedMessage.data.data, id: createId() })
          .run();
      }

      room.broadcast(event, [ws.id]);
    }
  },
};

export default server;
