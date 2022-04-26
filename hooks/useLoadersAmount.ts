import { useEffect, useState } from 'react';

type LoaderType = 'ActorCard' | 'WikiCard' | 'HistoryBlock';

interface useLoadersAmountProps {
  (loaderType: LoaderType): number;
}
type BreakPoints = {
  md: number;
  lg: number;
  max: number;
};
const breakPoints: BreakPoints = {
  md: 975,
  lg: 1280,
  max: 1920,
};

const loaders: { [field in LoaderType]: BreakPoints } = {
  ActorCard: {
    md: 3,
    lg: 6,
    max: 9,
  },
  WikiCard: {
    md: 3,
    lg: 5,
    max: 5,
  },
  HistoryBlock: {
    md: 3,
    lg: 6,
    max: 9,
  },
};

const countLoadersAmount = (loaderType: LoaderType): number => {
  const w = window.innerWidth;
  for (const [key, value] of Object.entries(breakPoints)) {
    if (w <= value) {
      return loaders[loaderType][key as keyof BreakPoints];
    } else return loaders[loaderType]['max'];
  }
  return loaders[loaderType]['max'];
};

const useLoadersAmount: useLoadersAmountProps = (loaderType) => {
  const [loadersAmount, setLoadersAmount] = useState(
    countLoadersAmount(loaderType)
  );

  const windowSizeChangeHandler = () => {
    setLoadersAmount(countLoadersAmount(loaderType));
  };

  useEffect(() => {
    window.addEventListener('resize', windowSizeChangeHandler);
    return () => {
      window.removeEventListener('resize', windowSizeChangeHandler);
    };
  }, []);
  return loadersAmount;
};

export default useLoadersAmount;
