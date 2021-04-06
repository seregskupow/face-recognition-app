const { Router } = require('express');
const router = Router();
//middlewares
const auth = require('../middlewares/auth.middleware');
const { DBController } = require('../controllers/DBController');

router.post('/parseactors', auth, DBController.parseActors);
router.get('/pagecount', auth, DBController.getPageCount);
router.post('/getsingleactor', auth, DBController.getSingleActor);

router.get('/loadhistory', auth, DBController.loadHistory);

module.exports = router;
