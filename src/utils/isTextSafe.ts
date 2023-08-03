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
export const isTextSafe = async (input: string) => {
  const zodSchema = z.object({
    unsafe: z.boolean().describe("Whether the text is unsafe"),
  });

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        "Does this text contain unsafe, foul, discriminatory, or harmful language?"
      ),
      HumanMessagePromptTemplate.fromTemplate("{inputText}"),
    ],
    inputVariables: ["inputText"],
  });

  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
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
