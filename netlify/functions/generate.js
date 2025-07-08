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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
