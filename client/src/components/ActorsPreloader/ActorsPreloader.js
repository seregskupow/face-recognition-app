import React from 'react';
import ActorPreloaderCard from './ActorPreloaderCard';

const ActorsPreloader = () => {
    return (
        <div className="actors-preloader">
            {Array(9).fill(<ActorPreloaderCard/>)}
        </div>
    );
}

export default ActorsPreloader;
