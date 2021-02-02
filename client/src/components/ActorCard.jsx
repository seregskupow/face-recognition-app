import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';
import Loader from './Loader';

const ActorCard = ({
  actorData: {
    image, name, birthday, birthPlace,
  },
}) => {
  const imageRef = useRef(null);
  const history = useHistory();
  const clickHandler = (e) => {
    history.push(`/actorinfo/${name.split(' ').join('_')}`);
  };
  // eslint-disable-next-line
  useEffect(() => () => {}, []);
  return (
    <div className="actor-card">
      <div role="button" tabIndex="0" onKeyPress={(event) => clickHandler(event)} className="actor-card-body" onClick={(event) => clickHandler(event)}>
        <div className="img-wrap">
          <LazyLoad placeholder={<Loader background="transparent" />} once>
            <img ref={imageRef} src={image.url} className="actor-img" alt="" />
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
                {birthPlace.split(':')[0]}
                :
              </span>
              {' '}
              {birthPlace.split(',').join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
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
