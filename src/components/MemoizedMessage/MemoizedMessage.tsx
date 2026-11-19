import { memo } from 'react';
import { TransformLink } from '../../utils/TransformLink';

export const MemoizedMessage = memo(function MemoizedMessage({
  msg,
  isUser,
  sender,
  index,
  styles,
  onImageClick,
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
  onImageClick?: (src: string) => void;
}) {
  return (
    <div
      key={index}
      className={`${styles.message} ${isUser ? styles.textRight : styles.textLeft} ${
        msg.mode === 'system' ? styles.errorMessage : ''
      }`}
    >
      <div className={styles.sender}>{sender}</div>

      {msg.content && (
        <span>
          {TransformLink(msg.content)}

          {msg.image && (
            <div
              className={styles.generatedImage}
              onClick={() => {
                if (msg.image) onImageClick?.(msg.image.src);
              }}
            >
              <img src={msg.image.src} alt="Generated image" />
            </div>
          )}
        </span>
      )}
    </div>
  );
});
