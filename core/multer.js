const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, 'file' + Date.now() + '.' + file.originalname.split('.').pop());
    req.name = file.originalname;
  },
});

const limits = {
  files: 1,
  fileSize: 5242880,
};

const upload = multer({
  storage: storage,
  limits,
}).single('actor');

module.exports = upload;
