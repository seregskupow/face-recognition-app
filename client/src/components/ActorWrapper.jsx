import React from 'react';
import LazyLoad from 'react-lazyload';
import ActorCard from './ActorCard';
import Loader from './Loader';
import PlaceHolder from '../images/film_placeholder.png';

const ActorWrapper = ({ data, date, image }) => {
  const newDate = new Date(date).toString();
  let img = image;
  const checkImg = ($this) => {
    $this.src = PlaceHolder;
    img = PlaceHolder;
  };
  return (
    <div className="actor-info-item col-12">
      <div className="actor-info-item-title-wrapper">
        {date ? <h1>{newDate.split('G')[0]}</h1> : null}
      </div>
      <LazyLoad placeholder={<Loader background="#1b1e24" />} once>
        <div className="actor-info-item-body">
          {image !== null && (
          <div className="actor-info-img">
            <div className="actor-info-img-wrapper">
              <img src={PlaceHolder} onLoad={(e) => e.target.src = img} onError={(e) => checkImg(e.target)} alt="actor-img" className="" />
            </div>
          </div>
          )}
          <div className="actors-in-photo">
            {data.map((actor, index) => (

              <ActorCard
                key={index * Math.random() * (9999 - 1000) * 1000}
                actorData={actor}
              />

            ))}
          </div>
        </div>
      </LazyLoad>
    </div>
  );
};

export default ActorWrapper;
