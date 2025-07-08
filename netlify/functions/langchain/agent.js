import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import { systemPrompts } from '../constants/systemPrompts';

export async function runAgent(queryMessages, mode) {
  const systemPrompt = systemPrompts[mode] || systemPrompts.neutral;

  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      basePath: process.env.BASE_PATH,
    },
    modelName: process.env.MODEL_NAME,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...queryMessages
      .map((msg) => {
        if (msg.role === 'user') return new HumanMessage(msg.content);
        if (msg.role === 'assistant') return new AIMessage(msg.content);
        return null;
      })
      .filter((msg) => msg !== null),
  ];

  const result = await model.invoke(messages);
  return result.content;
}
