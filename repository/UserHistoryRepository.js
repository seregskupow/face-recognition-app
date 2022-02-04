const { Types } = require('mongoose');
const userHistory = require('../dbmodels/userHistory');
const { logger } = require('../utils/logger');

class UserHistoryRepository {
  async getByPage({ owner, pageNumber, limit }) {
    try {
      return await userHistory
        .find({ owner })
        .sort({ $natural: -1 })
        .skip(pageNumber * limit)
        .limit(limit);
    } catch (e) {
      logger.error(e);
    }
  }

  async create({ actors, usedImage, owner, date }) {
    let history = new userHistory({
      actors,
      usedImage,
      owner,
      date,
    });
    await history.save();
  }

  async count(owner) {
    try {
      return await userHistory.find({ owner }).countDocuments();
    } catch (e) {
      logger.error(e);
    }
  }
  //For every actorName in userOwner.actors finds actor data from actors collection and merges objects and groups history by date(yyyy-mm-dd) desc
  async loadHistory(owner, pageNumber = 0, limit = 10) {
    try {
      return await userHistory
        .aggregate()
        .match({
          owner: Types.ObjectId(owner),
        })
        .sort({ date: -1 })
        .skip(pageNumber * limit)
        .limit(limit)
        .lookup({
          from: 'actors',
          localField: 'actors',
          foreignField: 'name',
          as: 'actorData',
        })
        .addFields({
          actorData: {
            $map: {
              input: '$actorData',
              as: 'actor',
              in: {
                $mergeObjects: [
                  {
                    id: '$$actor._id',
                    photo: '$$actor.image.url',
                    birthDay: '$$actor.birthday',
                  },
                  '$$actor',
                ],
              },
            },
          },
        })
        .project({
          'actorData.akas': 0,
          'actorData._id': 0,
          'actorData.knownFor': 0,
          'actorData.birthday': 0,
          'actorData.biography': 0,
          'actorData.image': 0,
          'actorData.__v': 0,
        })
        .group({
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          results: {
            $push: {
              actors: '$actorData',
              usedImage: '$usedImage',
              id: '$_id',
            },
          },
        })
        .project({
          date: '$_id',
          results: 1,
          _id: 0,
        })
        .sort({ date: -1 })
        .exec();
    } catch (e) {
      logger.error(e);
    }
  }
}
module.exports = UserHistoryRepository;
