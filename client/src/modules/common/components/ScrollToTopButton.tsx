import { useEffect, useState } from 'react';
import { Button } from 'antd';

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      type="primary"
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        zIndex: 1000,
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </Button>
  );
};
