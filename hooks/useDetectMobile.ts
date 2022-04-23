import { useEffect, useState } from 'react';

export const useDetectMobile = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' && window.innerWidth
  );

  const windowResizeHandler = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', windowResizeHandler);
    return () => {
      window.removeEventListener('resize', windowResizeHandler);
    };
  }, []);

  return width <= 900;
};
