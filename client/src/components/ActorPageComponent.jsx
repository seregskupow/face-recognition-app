import React, { useState, useEffect, useContext  } from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton } from 'react-awesome-button';
import { useHttp } from '../hooks/http.hook';
import Slider from '../utils/Slider';
import PlaceHolder from '../images/film_placeholder.png';
import 'react-awesome-button/dist/themes/theme-blue.css';
import {AuthContext} from "../context/AuthContext";
const ActorPageComponent = ({
  actor: {
    knownFor, image, name, birthday, birthPlace, biography,
  },
}) => {
	const {token} = useContext(AuthContext);
	let slider;
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
      {Authorization: `Bearer ${token}`},
    );
    setFilmData(result);
    if (filmData) initSlider();
  };
  const initSlider = () => {
     slider = new Slider({
      slider: document.querySelector('.slider-init'),
      next: document.querySelector('.slider__arrows--right'),
      prev: document.querySelector('.slider__arrows--left'),
    });
    slider.init();
  };
  useEffect(() => {
    fetchFilms(knownFor);
		return ()=>{
			slider && slider.destroy();
		}
  }, []);
  return (
    <>

      <section id="actorPage">
        <div className="actor-info page">
          <div className="actor-shortinfo-wrapper">
            <aside className="actor-shortinfo">
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

              <div className="actor-img">
                <img src={image.url} alt="" />
              </div>
            </aside>
          </div>
          <div className="actor-bio-wrapper">
            <div className="actor-bio">
              <h1 className="actor-bio-title">Biography</h1>
              <div className="actor-bio-text">
                <p>{biography}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {filmData.length > 0 && (
      <div className="actor-films page">
        <div className="actor-films-title-wrapper">
          <h1 className="actor-films-title">Top rated films</h1>
        </div>
        <div className="films-slider-wrap slider-init">
          <div className="slider-track">
            { filmData?.map((film, index) => (
                  <div
                    key={index * Math.random() * (9999 - 1111) * 1000}
										data-geh={`${Math.random() * (100 - 1 ) + 1}`}
                    className="film-card slide"
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

        </div>
        <div className="slider-arrow-wrapper">
          <div className="slider__arrows--left slider__arrow">&#10094;</div>
          <div className="slider__arrows--right slider__arrow">
            &#10095;
          </div>
        </div>
      </div>
      )}

    </>
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
