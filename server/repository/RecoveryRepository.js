const Recovery = require('../dbmodels/Recovery');
const { logger } = require('../utils/logger');
class RecoveryRepository {
  async findByCode(code) {
    try {
      return await Recovery.findOne({ code }).lean();
    } catch (e) {
      logger.error(e);
    }
  }

  async createRecovery({ code, email, recoveryToken }) {
    try {
      const recovery = new Recovery({ code, email, recoveryToken });
      await recovery.save();
    } catch (e) {
      logger.error(e);
    }
  }
}
module.exports = RecoveryRepository;
