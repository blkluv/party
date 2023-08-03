import { createClient } from "@libsql/client/web";
import { createId } from "@paralleldrive/cuid2";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type { PartyKitServer } from "partykit/server";
import { z } from "zod";
import type { InitialMessagesEvent } from "~/utils/chat";
import { socketEventSchema } from "~/utils/chat";
import * as schema from "../db/schema";

const getDb = (args: { url: string; authToken: string }) => {
  const libsqlClient = createClient(args);

  return drizzle(libsqlClient, { schema });
};

const getEnv = (envRecord: Record<string, unknown>) => {
  const env = z
    .object({
      OPENAI_API_KEY: z.string(),
      DATABASE_URL: z.string(),
      DATABASE_AUTH_TOKEN: z.string(),
    })
    .safeParse(envRecord);

  return env;
};

const server: PartyKitServer = {
  onConnect: async (ws, room) => {
    const env = getEnv(room.env);
    if (!env.success) {
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
    const env = z
      .object({
        OPENAI_API_KEY: z.string(),
        DATABASE_URL: z.string(),
        DATABASE_AUTH_TOKEN: z.string(),
      })
      .safeParse(room.env);

    if (!env.success) {
      return;
    }

    if (typeof event === "string") {
      const validatedMessage = socketEventSchema.safeParse(JSON.parse(event));

      if (!validatedMessage.success) {
        return;
      } else if (validatedMessage.data.__type === "CHAT_MESSAGE") {
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
