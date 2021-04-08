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
}
module.exports = UserHistoryRepository;
