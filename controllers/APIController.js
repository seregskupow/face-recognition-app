const fetch = require('node-fetch');
const config = require('config');
const utf8 = require('utf8');
const { logger } = require('../utils/logger');

class APIController {
  async Imdb(req, res) {
    try {
      logger.pending(
        'Fetching films: \n',
        ...req.body.filmNames.map((i) => i.filmName.trim() + '\n')
      );
      let filmsToFetch = req.body.filmNames;
      let filmData = [];
      let itemsProcessed = 0;
      filmsToFetch.forEach(async (item) => {
        let response = await fetch(
          `http://www.omdbapi.com/?t=${utf8.encode(
            item.filmName
          )}&apikey=${config.get('imdbAPI')}`
        );
        let key = await response.json();
        itemsProcessed++;
        if (!key.Error) {
          if (key['Title']) {
            filmData.push({
              title: key.Title,
              year: key.Year,
              genre: key.Genre,
              director: key.Director,
              poster: key.Poster,
              rating1: key.Metascore,
              rating2: key.imdbRating,
              link: item.filmURL,
            });
          } else {
            itemsProcessed++;
            return;
          }
        } else {
          logger.log('notok');
          return;
        }
        if (itemsProcessed === filmsToFetch.length) {
          res.status(200).json(filmData);
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports.APIController = new APIController();
