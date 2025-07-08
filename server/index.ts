import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { runAgent } from './langchain/agent';
import { CYAN, GRAY, RESET_COLOR, YELLOW } from '../constants/constants';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.post('/api/generate', async (req: Request, res: Response) => {
  const { messages, mode } = req.body;

  try {
    const response = await runAgent(messages, mode);
    res.json({ reply: response });
  } catch (error: any) {
    const status = error?.status || error?.code;

    if (status === 429) {
      console.log('Chat limit reached for today. Try again tomorrow.');
      return res.status(429).json({
        error: 'Chat limit reached for today. Try again tomorrow.',
      });
    }

    console.error('Error during agent response:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`
          ${CYAN}
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━►
    ┃ Server is running on port ${YELLOW}${port}${CYAN}
    ┃ ${GRAY}http://localhost:${port}${CYAN}
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━►
          ${RESET_COLOR}
          `);
});
