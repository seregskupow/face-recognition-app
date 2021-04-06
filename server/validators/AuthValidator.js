const { check, validationResult } = require('express-validator');

exports.register = [
  check('name', 'Name must be at least 6 characters').isLength({ min: 6 }),
  check('email', 'Incorrect email').normalizeEmail().isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
];

exports.login = [
  check('email', 'Incorrect email').normalizeEmail().isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
];
