import React, { FC } from 'react';
import LazyLoad from 'react-lazyload';
import ActorCard from './ActorCard';
import Loader from './Loader';
import PlaceHolder from '../images/film_placeholder.png';

interface ActorWrapperProps {
  data: any;
  date: string;
  image: string;
}

const ActorWrapper: FC<ActorWrapperProps> = ({ data, date, image }) => {
  const newDate = new Date(date).toString();
  let img = image;
  const checkImg = ($this: HTMLImageElement) => {
    $this.src = PlaceHolder;
    img = PlaceHolder;
  };
  return (
    <div className='actor-info-item col-12'>
      <div className='actor-info-item-title-wrapper'>
        {date ? <h1>{newDate.split('G')[0]}</h1> : null}
      </div>
      <LazyLoad placeholder={<Loader background='#1b1e24' />} once>
        <div className='actor-info-item-body'>
          {image !== null && (
            <div className='actor-info-img'>
              <div className='actor-info-img-wrapper'>
                <img
                  src={PlaceHolder}
                  onLoad={(e) => (e.currentTarget.src = img)}
                  onError={(e) => checkImg(e.currentTarget)}
                  alt='actor-img'
                  className=''
                />
              </div>
            </div>
          )}
          <div className='actors-in-photo'>
            {data.map((actor: any, index: number) => (
              <ActorCard
                key={index * Math.random() * (9999 - 1000) * 1000}
                image={actor.image}
                name={actor.name}
                birthday={actor.birthday}
                birthPlace={actor.birthPlace}
              />
            ))}
          </div>
        </div>
      </LazyLoad>
    </div>
  );
};

export default ActorWrapper;
