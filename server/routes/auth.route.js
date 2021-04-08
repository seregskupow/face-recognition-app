const { Router } = require('express');
const router = Router();
const AuthValidator = require('../validators/AuthValidator');
const { AuthController } = require('../controllers/AuthController');
const requireParams = require('../middlewares/params.middleware');
const {
  validationResultHandler,
} = require('../validators/ValidationResultHandler');

router.post(
  '/register',
  AuthValidator.register,
  validationResultHandler,
  requireParams(['name', 'email', 'password']),
  AuthController.register
);
router.post(
  '/login',
  AuthValidator.login,
  validationResultHandler,
  requireParams(['email', 'password']),
  AuthController.login
);

router.get('/checkauth', AuthController.checkAuth);
router.post(
  '/checkemail',
  requireParams(['email']),
  AuthController.verifyEmailToRecover
);
router.get('/:code', AuthController.verifyRecoveryCode);
router.post(
  '/recoverpassword',
  requireParams(['password']),
  AuthController.recoverPassword
);

module.exports = router;
