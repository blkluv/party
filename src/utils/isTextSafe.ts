import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { z } from "zod";

/**
 * SERVER ONLY
 */
export const isTextSafe = async (
  input?: string | null,
  config?: {
    apiKey?: string;
    filters?: string[];
  }
) => {
  if (!input) {
    return true;
  }

  const zodSchema = z.object({
    unsafe: z
      .boolean()
      .describe("Whether the text contains racist or threatening language"),
  });

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        "Does this text contain racist or threatening language?"
      ),
      HumanMessagePromptTemplate.fromTemplate("{inputText}"),
    ],
    inputVariables: ["inputText"],
  });

  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: config?.apiKey,
  });

  const chain = createStructuredOutputChainFromZod(zodSchema, {
    prompt,
    llm,
  });

  const response = await chain.call({
    inputText: input,
  });

  const data = zodSchema.safeParse(response.output);

  if (data.success) {
    return data.data.unsafe === false;
  }

  return true;
};
