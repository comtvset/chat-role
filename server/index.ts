import 'dotenv/config';
import express from 'express';
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

app.post('/api/generate', async (req, res) => {
  const { messages, mode } = req.body;

  try {
    const response = await runAgent(messages, mode);
    res.json({ reply: response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
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
