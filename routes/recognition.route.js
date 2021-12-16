const { Router } = require('express');
const router = Router();

//middlewares
const auth = require('../middlewares/auth.middleware');

const {
  RecognitionController,
} = require('../controllers/RecognitionController');

router.post('/upload', auth, RecognitionController.processImage);

router.get('/train', RecognitionController.trainModels);

module.exports = router;
