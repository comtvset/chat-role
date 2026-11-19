import { useEffect } from 'react';
import './ImageModal.css';
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
      className="image-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>
        <img src={src} alt={alt} className="image-modal-img" />
        <a
          href={src}
          download
          className="image-modal-download"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={22} />
        </a>
      </div>
    </div>
  );
};
