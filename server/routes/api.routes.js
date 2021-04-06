const { Router } = require('express');
const router = Router();
const { APIController } = require('../controllers/APIController');

router.post('/imdb', APIController.Imdb);

module.exports = router;
