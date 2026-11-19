import { useEffect } from 'react';
import styles from './ImageModal.module.scss';
import { Download, X } from 'lucide-react';

export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

export const ImageModal = ({ isOpen, onClose, src, alt = 'Image' }: ImageModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>
        <img src={src} alt={alt} className={styles.image} />
        <a
          href={src}
          download
          className={styles.download}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={22} />
        </a>
      </div>
    </div>
  );
};
