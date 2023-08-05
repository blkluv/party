import { z } from "zod";
import { insertChatMessageSchema } from "~/db/schema";

export const chatMessageEventSchema = z.object({
  __type: z.literal("CHAT_MESSAGE"),
  data: insertChatMessageSchema,
});
export type ChatMessageEvent = z.infer<typeof chatMessageEventSchema>;

export const initialMessagesEventSchema = z.object({
  __type: z.literal("INITIAL_MESSAGES"),
  data: z.object({ messages: chatMessageEventSchema.array() }),
});
export type InitialMessagesEvent = z.infer<typeof initialMessagesEventSchema>;

export const userJoinedEventSchema = z.object({
  __type: z.literal("USER_JOINED"),
  data: z.object({ userId: z.string(), name: z.string() }),
});
export type UserJoinedEvent = z.infer<typeof userJoinedEventSchema>;

export const tooManyMessagesEventSchema = z.object({
  __type: z.literal("TOO_MANY_MESSAGES"),
  data: z.object({ message: z.string() }),
});
export type TooManyMessagesEvent = z.infer<typeof tooManyMessagesEventSchema>;

export const socketEventSchema = chatMessageEventSchema
  .or(initialMessagesEventSchema)
  .or(userJoinedEventSchema);

export type ChatSocketEvent = z.infer<typeof socketEventSchema>;
