import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { z } from "zod";
import { getDb } from "~/db/client";
import { events } from "~/db/schema";

/**
 * SERVER ONLY
 */
export const createTicketFunText = async (args: {
  userId?: string | null;
  eventId: string;
}) => {
  if (!args.userId) {
    return "";
  }

  const db = getDb();

  const user = await clerkClient.users.getUser(args.userId);
  const eventData = await db.query.events.findFirst({
    where: eq(events.id, args.eventId),
    columns: {
      name: true,
      description: true,
    },
  });

  if (!user || !eventData) {
    return "";
  }
  const zodSchema = z.object({
    message: z.string().describe("The fun message to the user"),
  });

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      HumanMessagePromptTemplate.fromTemplate(
        `My name is {userName}. The event I'm going to is named "{eventName}" and is described as: {eventDescription}`
      ),
      SystemMessagePromptTemplate.fromTemplate(
        "Create a personalized message to the user, making references to both their name and the theme of the event. The message should be no longer than 15 words. The message should create excitement and be funny."
      ),
    ],
    inputVariables: ["userName", "eventDescription", "eventName"],
  });

  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 1.5,
  });

  const chain = createStructuredOutputChainFromZod(zodSchema, {
    prompt,
    llm,
  });

  const response = await chain.call({
    userName: `${user.firstName}`,
    eventDescription: eventData.description,
    eventName: eventData.name,
  });

  const data = zodSchema.safeParse(response.output);

  if (data.success) {
    return data.data.message;
  }

  return "";
};
