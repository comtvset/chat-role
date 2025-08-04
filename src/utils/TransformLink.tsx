import type { JSX } from 'react';
import { GeneratedImageLink } from './GeneratedImageLink';

export function TransformLink(text: string): JSX.Element[] {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return parts.map((part, i) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      if (part.includes('pollinations.ai')) {
        return <GeneratedImageLink key={i} url={part} />;
      }

      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          link
        </a>
      );
    }

    return <div key={i}>{part}</div>;
  });
}
