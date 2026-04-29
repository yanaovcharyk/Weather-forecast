import { useEffect, useState } from 'react';

export const useSmartBackground = (image: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();

    img.onload = () => {
      if (!cancelled) {
        setLoaded(true);
      }
    };

    img.src = image;

    return () => {
      cancelled = true;
    };
  }, [image]);

  return { loaded };
};
