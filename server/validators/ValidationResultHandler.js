const { validationResult } = require('express-validator');

exports.validationResultHandler = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (e) {
    res.status(422).json({ errors: e.mapped(), message: e.mapped() });
  }
};
