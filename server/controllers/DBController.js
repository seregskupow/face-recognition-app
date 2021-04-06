const config = require('config');
//mongoDB models
const userHistory = require('../dbmodels/userHistory');
const Actor = require('../dbmodels/Actor');
const { logger } = require('../utils/logger');

//helper modules
const scrapper = require('../modules/actorParser');

class DBController {
  constructor() {
    this.parseActors = this.parseActors.bind(this);
  }
  async searchActors(labels) {
    let foundActors = [];
    let shouldParse = [];
    for (let i = 0; i < labels.length; i++) {
      const actor = await Actor.findOne({ name: labels[i] });
      if (actor) {
        foundActors.push(actor);
      } else {
        shouldParse.push(labels[i]);
      }
    }
    return { foundActors, shouldParse };
  }

  async parseActors(req, res) {
    try {
      logger.log(req.body.imgUrl);
      let { foundActors, shouldParse } = await this.searchActors(
        req.body.labels
      );
      logger.success(
        'Found in db actors: ',
        foundActors.map((item) => item.name)
      );
      logger.pending('Actors to parse: ', shouldParse);
      if (shouldParse.length > 0) {
        scrapper('https://www.rottentomatoes.com/celebrity/', shouldParse).then(
          (response) => {
            if (response === 'error') {
              res.status(404).json({ msg: 'couldn`t find any actordata' });
              return;
            }
            let data = [];
            if (foundActors.length > 0) {
              data = response.concat(foundActors);
            }
            let shouldSave = data.length > 0 ? data : response;
            res
              .status(200)
              .json({ actorData: data.length > 0 ? data : response });
            response.forEach(async (item) => {
              let find = await Actor.findOne({ name: item.name });
              if (find) {
                return;
              }
              let actor = new Actor({
                name: item.name,
                image: item.image,
                knownFor: item.knownFor,
                birthday: item.birthday,
                birthPlace: item.birthPlace,
                biography: item.biography,
              });
              actor.save();
              console.log(
                done(item.name, 'Actor has been successfuly saved to db')
              );
            });
            const history = new userHistory({
              actors: shouldSave.map((item) => item.name),
              usedImage: req.body.imgUrl.split('/').pop(),
              owner: req.user.userId,
              date: req.body.time,
            });
            history.save();
            logger.success('User history has been saved successfuly');
          }
        );
      } else if (shouldParse.length === 0 && foundActors.length > 0) {
        res.status(200).json({ actorData: foundActors });
        const history = new userHistory({
          actors: foundActors.map((item) => item.name),
          usedImage: req.body.imgUrl.split('/').pop(),
          owner: req.user.userId,
          date: req.body.time,
        });
        history.save();
        logger.success('User history has been saved successfuly');
      } else {
        res.status(404).json({ msg: 'coudn`t find any actordata' });
      }
    } catch (e) {
      res.status(500).json({ msg: e.message });
      logger.error(e);
    }
  }

  async getPageCount(req, res) {
    try {
      userHistory
        .find({ owner: req.user.userId })
        .count()
        .then((data) => {
          res.status(200).json({
            count: data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            err: err,
          });
        });
    } catch (e) {
      res.status(500).json({ msg: e.msg });
      logger.error(e);
    }
  }

  async getSingleActor(req, res) {
    try {
      let actor = await Actor.findOne({ name: req.body.name });
      res.status(200).json({ actor });
    } catch (e) {
      res.status(500).json({ msg: e.msg });
      logger.error(e);
    }
  }

  async loadHistory(req, res) {
    try {
      let pageNum = req.query.page;
      const historyRawData = (
        await userHistory
          .find({ owner: req.user.userId })
          .sort({ $natural: -1 })
          .skip(pageNum * 10)
          .limit(10)
      ).reverse();
      async function parseHistory(historyRaw) {
        let history = [];
        for (let i = 0; i < historyRaw.length; i++) {
          let actors = [];
          if (historyRaw[i].actors.length > 0) {
            for (let j = 0; j < historyRaw[i].actors.length; j++) {
              let actor = await Actor.findOne({
                name: historyRaw[i].actors[j],
              });
              if (actor) {
                actors.push(actor);
              }
            } ///////change in prod
            history.push({
              date: historyRaw[i].date,
              actors,
              usedImg: historyRaw[i].usedImage
                ? config.get('adress') +
                  '/' +
                  historyRaw[i].usedImage.split('/').pop()
                : null,
            });
          }
        }
        return history;
      }

      let history = await parseHistory(historyRawData);

      res.status(200).json({ history });
    } catch (e) {
      res.status(401).json({ message: 'e' });
      logger.error(e);
    }
  }
}
module.exports.DBController = new DBController();
