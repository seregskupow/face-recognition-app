const { Router } = require('express');
const router = Router();
const { APIController } = require('../controllers/APIController');

const auth = require('../middlewares/auth.middleware');
const requireParams = require('../middlewares/params.middleware');

router.post('/imdb', auth, requireParams(['filmNames']), APIController.Imdb);

module.exports = router;
