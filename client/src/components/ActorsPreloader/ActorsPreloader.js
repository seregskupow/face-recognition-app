import React from 'react';
import ActorPreloaderCard from './ActorPreloaderCard';

const ActorsPreloader = () => {
  const arrL = () => {
    const w = window.innerWidth;
    if (w <= 600) return 3;
    if (w <= 1280) return 6;
    return 9;
  };
  return <>{Array(arrL()).fill(<ActorPreloaderCard />)}</>;
};

export default ActorsPreloader;
