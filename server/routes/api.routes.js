const { Router } = require("express");
const router = Router();
const fetch = require("node-fetch");
const config = require("config");
const utf8 = require("utf8");
const chalk = require("chalk");
const action = chalk.bold.hex("#dbab79");
router.post("/imdb", async (req, res) => {
  try {
    console.log('filmnames',req.body.filmNames);
    let filmsToFetch = req.body.filmNames;
    let filmData = [];
    let itemsProcessed = 0;
    filmsToFetch.forEach(async (item) => {
      let response = await fetch(
        `http://www.omdbapi.com/?t=${utf8.encode(
          item.filmName
        )}&apikey=f1cc94c6`
      );
      let key = await response.json();
      itemsProcessed++;
      if (!key.Error) {
        if (key["Title"]) {
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
        console.log("notok");
        return;
      }
      if (itemsProcessed === filmsToFetch.length) {
        res.status(200).json(filmData);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
