import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import styles from './Chat.module.scss';
import { Role } from '../Role/Role';

import neutralImg from '../../assets/neutral.png';
import developerImg from '../../assets/developer.png';
import designerImg from '../../assets/designer.png';
import philosopherImg from '../../assets/philosopher.png';
import hoodlumImg from '../../assets/hoodlum.png';
import detectiveImg from '../../assets/detective.png';
import scientistImg from '../../assets/scientist.png';
import psychologistImg from '../../assets/psychologist.png';
import { getApiBase } from '../../utils/getApiBase';

import TextareaAutosize from 'react-textarea-autosize';
import { MemoizedMessage } from '../MemoizedMessage/MemoizedMessage';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode?: string;
};

const MODES = [
  { key: 'neutral', name: 'neutral', img: neutralImg },
  { key: 'developer', name: 'developer', img: developerImg },
  { key: 'designer', name: 'designer', img: designerImg },
  { key: 'philosopher', name: 'philosopher', img: philosopherImg },
  { key: 'hoodlum', name: 'hoodlum', img: hoodlumImg },
  { key: 'detective', name: 'detective', img: detectiveImg },
  { key: 'scientist', name: 'scientist', img: scientistImg },
  { key: 'psychologist', name: 'psychologist', img: psychologistImg },
];

const apiBase = await getApiBase();

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('neutral');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const updated = [
      ...messages,
      { role: 'user', content: input },
    ] satisfies Message[];
    setMessages(updated);
    setInput('');

    try {
      const res = await axios.post(`${apiBase}/generate`, {
        messages: updated,
        mode,
      });

      const reply: Message = {
        role: 'assistant',
        content: res.data.reply,
        mode,
      };
      setMessages([...updated, reply]);
    } catch (error: unknown) {
      console.error('Request error:', error);

      let errorMessage = 'Something went wrong. Please try again.';

      if (axios.isAxiosError(error)) {
        if (
          apiBase === '/.netlify/functions' ||
          error.response?.status === 429
        ) {
          errorMessage = 'Chat limit reached for today. Try again tomorrow.';
        }
      }

      const reply: Message = {
        role: 'assistant',
        content: errorMessage,
        mode: 'system',
      };
      setMessages([...updated, reply]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div>
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const sender = isUser
            ? 'You'
            : msg.mode
            ? msg.mode.charAt(0).toUpperCase() + msg.mode.slice(1)
            : 'Assistant';

          return (
            <MemoizedMessage
              key={i}
              msg={msg}
              isUser={isUser}
              sender={sender}
              index={i}
              styles={styles}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className={styles.stickyInput}>
        <TextareaAutosize
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask anything..."
          className={styles.inputField}
        />

        <div className={styles.rolesContainer}>
          {MODES.map((role) => (
            <Role
              key={role.key}
              img={role.img}
              role={role.name}
              active={mode === role.key}
              onClick={() => setMode(role.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
