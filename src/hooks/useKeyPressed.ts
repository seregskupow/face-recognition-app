import { useEffect } from 'react';
import { Key } from 'ts-key-enum';

type Keys = keyof typeof Key;

const useKeyPressed = (targetKey: Keys, callback: () => void) => {
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, []); // Empty
};

export default useKeyPressed;
