import { z } from "zod";

export const chatMessageEventSchema = z.object({
  __type: z.literal("CHAT_MESSAGE"),
  data: z.object({
    userId: z.string(),
    message: z.string(),
    name: z.string(),
    createdAt: z.string(),
    imageUrl: z.string(),
  }),
});
export type ChatMessageEvent = z.infer<typeof chatMessageEventSchema>;

export const initialMessagesEventSchema = z.object({
  __type: z.literal("INITIAL_MESSAGES"),
  data: z.object({ messages: chatMessageEventSchema.array() }),
});

export const userJoinedEventSchema = z.object({
  __type: z.literal("USER_JOINED"),
  data: z.object({ userId: z.string(), name: z.string() }),
});
export type UserJoinedEvent = z.infer<typeof userJoinedEventSchema>;

export const socketEventSchema = chatMessageEventSchema
  .or(initialMessagesEventSchema)
  .or(userJoinedEventSchema);

export type ChatSocketEvent = z.infer<typeof socketEventSchema>;
