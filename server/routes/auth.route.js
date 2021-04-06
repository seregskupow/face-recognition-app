const { Router } = require('express');
const router = Router();
const AuthValidator = require('../validators/AuthValidator');
const { AuthController } = require('../controllers/AuthController');

const {
  validationResultHandler,
} = require('../validators/ValidationResultHandler');

router.post(
  '/register',
  AuthValidator.register,
  validationResultHandler,
  AuthController.register
);
router.post(
  '/login',
  AuthValidator.login,
  validationResultHandler,
  AuthController.login
);

router.get('/checkauth', AuthController.checkAuth);
router.post('/checkemail', AuthController.verifyEmailToRecover);
router.get('/:code', AuthController.verifyRecoveryCode);
router.post('/recoverpassword', AuthController.recoverPassword);

module.exports = router;
