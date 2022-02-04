const { Router } = require('express');
const router = Router();
//middlewares
const auth = require('../middlewares/auth.middleware');
const requireParams = require('../middlewares/params.middleware');
const { DBController } = require('../controllers/DBController');

router.post(
  '/parseactors',
  auth,
  requireParams(['imgUrl', 'labels', 'time']),
  DBController.parseActors
);

router.post(
  '/getsingleactor',
  auth,
  requireParams(['name']),
  DBController.getSingleActor
);
router.post(
  '/getsingleactornew',
  auth,
  requireParams(['name']),
  DBController.getSingleActorNew
);

router.get('/loadhistory', auth, DBController.loadHistory);
router.post(
  '/parsewikiactors',

  requireParams(['actorNames']),
  DBController.parseWikiActors
);

module.exports = router;
