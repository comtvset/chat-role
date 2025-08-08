import type { JSX } from 'react';
import { GeneratedImageLink } from './GeneratedImageLink';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function TransformLink(text: string): JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a({ href, children }) {
          if (href?.includes('image.pollinations.ai')) {
            const match = href.match(/\/prompt\/(.+)$/);
            const prompt = match ? decodeURIComponent(match[1]) : 'unknown';
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
              prompt
            )}?nologo=true&model=flux`;

            return <GeneratedImageLink url={url} />;
          }

          return (
            <a href={href!} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
