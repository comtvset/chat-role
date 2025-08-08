import { memo } from 'react';
import { TransformLink } from '../../utils/TransformLink';

export const MemoizedMessage = memo(function MemoizedMessage({
  msg,
  isUser,
  sender,
  index,
  styles,
}: {
  msg: { content: string; role: string; mode?: string };
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
      <span>{TransformLink(msg.content)}</span>
    </div>
  );
});
