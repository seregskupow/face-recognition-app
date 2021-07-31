import React from 'react';

const ActorPreloaderCard = () => (
  <div className='actor-card actor-preloader-card'>
    <div className='actor-card-body'>
      <div className='img-wrap' />
      <div className='card-right'>
        <div className='name-wrapper'>
          <div className='text-preloader preloader-name' />
          <div className='stripe' />
        </div>
        <div className='text-preloader-container'>
          <div className='text-preloader' />
          <div className='text-preloader' />
          <div className='text-preloader' />
        </div>
      </div>
    </div>
  </div>
);

export default ActorPreloaderCard;
