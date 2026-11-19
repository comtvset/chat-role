import { memo } from 'react';
import { TransformLink } from '../../utils/TransformLink';

export const MemoizedMessage = memo(function MemoizedMessage({
  msg,
  isUser,
  sender,
  index,
  styles,
}: {
  msg: {
    content: string;
    role: string;
    mode?: string;
    image?: {
      src: string;
      mediaType: string;
    } | null;
  };
  isUser: boolean;
  sender: string;
  index: number;
  styles: Record<string, string>;
}) {
  return (
    <div
      key={index}
      className={`${styles.message} ${
        isUser ? styles.textRight : styles.textLeft
      } ${msg.mode === 'system' ? styles.errorMessage : ''}`}
    >
      <div className={styles.sender}>{sender}</div>

      {msg.content && (
        <span>
          {TransformLink(msg.content)}

          {msg.image && (
            <div className={styles.generatedImage}>
              <a href={msg.image.src} target="_blank" rel="noopener noreferrer">
                <img src={msg.image.src} alt="Generated image" />
              </a>
            </div>
          )}
        </span>
      )}
    </div>
  );
});
