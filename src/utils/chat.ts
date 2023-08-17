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

export const errorEventSchema = z.object({
  __type: z.literal("ERROR"),
  data: z.object({
    code: z.enum(["TOO_MANY_MESSAGES", "BAD_MESSAGE", "UNAUTHORIZED"]),
    message: z.string(),
  }),
});
export type ChatErrorEvent = z.infer<typeof errorEventSchema>;

export const userTypingEventSchema = z.object({
  __type: z.literal("USER_TYPING"),
  data: z.object({
    userId: z.string(),
    status: z.enum(["start", "stop"]),
    startedAt: z.coerce.date(),
  }),
});
export type UserTypingEvent = z.infer<typeof userTypingEventSchema>;

export const socketEventSchema = chatMessageEventSchema
  .or(initialMessagesEventSchema)
  .or(errorEventSchema)
  .or(userTypingEventSchema)
  .or(userJoinedEventSchema);

export type ChatSocketEvent = z.infer<typeof socketEventSchema>;
