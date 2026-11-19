import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  ToolMessage,
} from '@langchain/core/messages';

import { systemPrompts } from '../../netlify/functions/constants/systemPrompts';
import { generateImage } from '../utils/generateImage';

const imageTool = {
  type: 'function' as const,
  function: {
    name: 'generate_image',
    description:
      'Generate an image when the user explicitly asks to create, draw, generate or visualize an image. Use a detailed English prompt describing the desired image.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Detailed English description of the image to generate.',
        },
        aspectRatio: {
          type: 'string',
          enum: ['1:1', '16:9', '9:16', '4:3', '3:2'],
          description: 'Image aspect ratio. Use 1:1 if not specified.',
        },
      },
      required: ['prompt'],
    },
  },
};

function getTextContent(content: unknown): string {
  if (typeof content === 'string') return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;

        if (
          item &&
          typeof item === 'object' &&
          'text' in item &&
          typeof item.text === 'string'
        ) {
          return item.text;
        }

        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

export async function runAgent(
  queryMessages: { role: string; content: string }[],
  mode: keyof typeof systemPrompts,
) {
  const systemPrompt = systemPrompts[mode] || systemPrompts.neutral;

  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      basePath: process.env.BASE_PATH,
    },
    modelName: process.env.MODEL_NAME,
  });

  const modelWithTools = model.bindTools([imageTool]);

  const messages = [
    new SystemMessage(
      `${systemPrompt}

If the user asks to generate, create, draw or visualize an image, use the generate_image tool.
Do not use the tool for ordinary questions about images or image-related discussions.`,
    ),
    ...queryMessages.flatMap((msg) => {
      if (!msg || typeof msg.content !== 'string') {
        console.warn('Invalid message skipped:', msg);
        return [];
      }

      if (msg.role === 'user') {
        return [new HumanMessage(msg.content)];
      }

      if (msg.role === 'assistant') {
        return [new AIMessage(msg.content)];
      }

      return [];
    }),
  ];

  const result = await modelWithTools.invoke(messages);

  console.log('MODEL RESPONSE:', {
    content: result.content,
    tool_calls: result.tool_calls,
    additional_kwargs: result.additional_kwargs,
    invalid_tool_calls: result.invalid_tool_calls,
  });

  if (!result.tool_calls?.length) {
    return {
      reply: getTextContent(result.content),
      image: null,
    };
  }

  let generatedImage: Awaited<ReturnType<typeof generateImage>> | null = null;

  const toolMessages = await Promise.all(
    result.tool_calls.map(async (toolCall) => {
      if (toolCall.name !== 'generate_image') {
        return new ToolMessage({
          content: 'Unknown tool.',
          tool_call_id: toolCall.id!,
        });
      }

      if (generatedImage) {
        return new ToolMessage({
          content: 'An image has already been generated.',
          tool_call_id: toolCall.id!,
        });
      }

      try {
        const { prompt, aspectRatio } = toolCall.args as {
          prompt: string;
          aspectRatio?: string;
        };

        generatedImage = await generateImage({
          prompt,
          aspectRatio,
        });

        return new ToolMessage({
          content: 'Image generated successfully.',
          tool_call_id: toolCall.id!,
        });
      } catch (error) {
        console.error('Image generation error:', error);

        return new ToolMessage({
          content: 'Image generation failed.',
          tool_call_id: toolCall.id!,
        });
      }
    }),
  );

  const finalResult = await modelWithTools.invoke([
    ...messages,
    result,
    ...toolMessages,
  ]);

  return {
    reply: getTextContent(finalResult.content),
    image: generatedImage,
  };
}
