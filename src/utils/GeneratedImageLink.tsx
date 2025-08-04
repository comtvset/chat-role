import { useEffect, useState } from 'react';

type Props = {
  url: string;
};

export const GeneratedImageLink = ({ url }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = url;

    img.onload = () => setLoaded(true);
    img.onerror = () => setFailed(true);
  }, [url]);

  if (failed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        link (error loading)
      </a>
    );
  }

  if (!loaded) {
    return <span>Generating...</span>;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img
        src={url}
        alt="image"
        style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }}
      />
    </a>
  );
};
