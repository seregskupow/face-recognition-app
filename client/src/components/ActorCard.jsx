import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';
import Loader from './Loader';
import PlaceHolder from '../images/film_placeholder.png';

const ActorCard = ({
  actorData: {
    image, name, birthday, birthPlace,
  },
}) => {
  const imageRef = useRef(null);
  const checkImg = ($this) => {
    $this.src = PlaceHolder;
  };
  // eslint-disable-next-line
  useEffect(() => () => {}, []);
  return (
    <NavLink to={`/actorinfo/${name?.split(' ').join('_')}`} className="actor-card">
      <div className="actor-card-body">
        <div className="img-wrap">
          <LazyLoad placeholder={<Loader background="transparent" />} once>
            <img src={PlaceHolder} onLoad={(e) => e.target.src = image.url} onError={(e) => checkImg(e.target)} className="actor-img" alt="" />
          </LazyLoad>
        </div>
        <div className="card-right">
          <div className="name-wrapper">
            <h4>{name}</h4>
            <div className="stripe" />
          </div>
          <div className="actor-short-info">
            <p>
              <span>
                {birthday.split(':')[0]}
                :
              </span>
              {' '}
              {birthday.split(':')[1]}
            </p>
            <p>
              <span>
                Birthplace
                :
              </span>
              {' '}
              {birthPlace.split(',').join(', ').replace('Birthplace:', '')}
            </p>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

ActorCard.propTypes = {
  actorData: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    birthday: PropTypes.string,
    birthPlace: PropTypes.string,
  }).isRequired,
};
export default ActorCard;
