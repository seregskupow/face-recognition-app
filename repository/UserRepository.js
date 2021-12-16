const User = require('../dbmodels/User');
const { logger } = require('../utils/logger');

class UserRepository {
  async findByEmail(email) {
    try {
      return await User.findOne({ email }).lean();
    } catch (e) {
      logger.error(e);
    }
  }
  async findById(id) {
    try {
      return await User.findOne({ _id: id }).lean();
    } catch (e) {
      logger.error(e);
    }
  }
  async createUser({ name, email, password }) {
    const user = new User({ name, email, password });
    await user.save();
  }
  async updatePassword(id, password) {
    try {
      User.findByIdAndUpdate({ id }, { password });
    } catch (e) {
      logger.error(e);
    }
  }
}
module.exports = UserRepository;
