import { runAgent } from './langchain/agent';

export const handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { messages, mode } = JSON.parse(event.body || '{}');

    const response = await runAgent(messages, mode);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error in generate function:', error);

    const status = error?.status || error?.code;

    if (status === 429) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          error: 'Chat limit reached for today. Try again tomorrow.',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
