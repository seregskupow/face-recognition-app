const Actor = require('../dbmodels/Actor');
const { logger } = require('../utils/logger');
class ActorRepository {
  async findByName(name) {
    try {
      return await Actor.findOne({ name }).lean();
    } catch (e) {
      logger.error(e);
    }
  }

  async createActor({
    name,
    image,
    knownFor,
    birthday,
    birthPlace,
    biography,
  }) {
    try {
      let actor = new Actor({
        name,
        image,
        knownFor,
        birthday,
        birthPlace,
        biography,
      });
      await actor.save();
    } catch (e) {
      logger.error(e);
    }
  }
}

module.exports = ActorRepository;
