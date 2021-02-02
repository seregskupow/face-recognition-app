import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ColorThief from 'colorthief/dist/color-thief.mjs';
import { AwesomeButton } from 'react-awesome-button';
import { useHttp } from '../hooks/http.hook';
import Slider from '../utils/Slider';
import PlaceHolder from '../images/film_placeholder.png';
import 'react-awesome-button/dist/themes/theme-blue.css';

const ActorPageComponent = ({
  actor: {
    knownFor, image, name, birthday, birthPlace, biography,
  },
}) => {
  const [filmData, setFilmData] = useState([]);
  const { request } = useHttp();
  const fetchFilms = async (filmArr) => {
    const filmNames = filmArr.map((item) => ({
      // eslint-disable-next-line
        filmName: item.filmName.split(/[-$%^&*()_+|~=`{}\[\]";'<>\/]/)[0],
      filmURL: item.filmURL,
    }));
    const result = await request(
      '/api/thirdparty/imdb',
      'POST',
      { filmNames },
      {},
    );
    setFilmData(result);
    if (filmData) initSlider();
  };

  const initSlider = () => {
    const slider = new Slider(document.querySelectorAll('.film-card'));
    const btn_next = document.querySelector('.slider__arrows--right');
    const btn_prev = document.querySelector('.slider__arrows--left');
    btn_next.addEventListener('click', slider.next_slide);
    btn_prev.addEventListener('click', slider.prev_slide);
    slider.init();
  };
  useEffect(() => {
    fetchFilms(knownFor);
  }, [knownFor]);
  return (
    <section id="actorPage">
      <div className="actor-page-wrapper">
        <div className="actor-info page">
          <div className="actor-info-wrapper">
            <div className="actor-img">
              <img src={image.url} alt="" />
            </div>
            <div className="actor-data">
              <div className="actor-data-wrapper">
                <h1 className="actor-data-name">{name}</h1>
                <p>
                  <span>{birthday.split(':')[0]}</span>
                  :
                  {' '}
                  {birthday.split(':')[1]}
                </p>
                <p>
                  <span>{birthPlace.split(':')[0]}</span>
                  :
                  {' '}
                  {birthPlace.split(':')[1]}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="actor-bio page">
          <h1 className="actor-bio-title">Biography</h1>
          <div className="actor-bio-wrapper">
            <p>{biography}</p>
          </div>
        </div>
        {filmData.length > 0 && (
          <div className="actor-films page">
            <div className="actor-films-title-wrapper">
              <h1 className="actor-films-title">Top rated films</h1>
            </div>
            <div className="actor-films-wrap">
              {filmData
                && filmData.map((film, index) => (
                  <div
                    key={index * Math.random() * (9999 - 1111) * 1000}
                    className="film-card"
                  >
                    <div className="film-card-wrapper">
                      <div className="img-wrap">
                        <img
                          src={
                            film.poster !== 'N/A' ? film.poster : PlaceHolder
                          }
                          alt=""
                        />
                      </div>
                      <div className="film-details">
                        <div className="film-title">
                          <h1>{film.title}</h1>
                        </div>
                        <div className="film-info">
                          <p className="item-appear">
                            <span>Metascore:</span>
                            {' '}
                            {film.rating1}
                            /100
                          </p>
                          <div className="rating-wrapper item-appear">
                            <div
                              className="rating"
                              style={{ width: `${film.rating1}%` }}
                            />
                          </div>
                          <p className="item-appear">
                            <span>Imdb:</span>
                            {' '}
                            {film.rating2}
                            /10
                          </p>
                          <div className="rating-wrapper item-appear">
                            <div
                              className="rating"
                              style={{ width: `${+film.rating2 * 10}%` }}
                            />
                          </div>
                          <p className="item-appear">
                            <span>Year:</span>
                            {' '}
                            {film.year}
                          </p>
                          <p className="item-appear">
                            <span>Genre:</span>
                            {' '}
                            {film.genre}
                          </p>
                          <p className="item-appear">
                            <span>Director:</span>
                            {' '}
                            {film.director}
                          </p>
                          <div className="film-url" />
                        </div>
                        <div className="link-wrapper">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={film.link}
                          >
                            <AwesomeButton
                              type="primary"
                              size="large"
                              button-hover-pressure="3"
                            >
                              More details
                            </AwesomeButton>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="slider-arrow-wrapper">
              <div className="slider__arrows--left slider__arrow">&#10094;</div>
              <div className="slider__arrows--right slider__arrow">
                &#10095;
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

ActorPageComponent.propTypes = {
  actor: PropTypes.shape({
    knownFor: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    birthday: PropTypes.string,
    birthPlace: PropTypes.string,
    biography: PropTypes.string,
  }).isRequired,
};

export default ActorPageComponent;
