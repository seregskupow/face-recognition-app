const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const config = require('config');
const shortid = require('shortid');
var jwt = require('jsonwebtoken');
const router = Router();
const User = require('../dbmodels/User');
const Recovery = require('../dbmodels/Recovery');
var bcrypt = require('bcryptjs');

router.post(
  '/register',
  [
    check('name', 'Name must be at least 6 characters').isLength({ min: 6 }),
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
          message: 'Incorrect email or password',
        });
      }
      const { name, email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: 'Such user already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 15);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User created', success: true });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }
);
router.post(
  '/login',
  [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
          message: 'Incorrect email or password',
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      //validate password
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass)
        return res.status(401).json({ message: 'Incorrect password' });
      //create token
      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'));
      res.json({ token, userId: user.id, userName: user.name });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }
);

router.get('/checkauth', async (req, res) => {
  if (req.cookies) {
    if (!req.cookies.auth) {
      res.json({ message: 'not auth' });
    }
    res.json({ message: 'success' });
  }
});
router.post('/checkemail', async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Such user doesn`t exist' });
    }
    const code = shortid.generate();
    const recoveryToken = jwt.sign({ email }, config.get('jwtSecret'));
    const recovery = new Recovery({ code, email, recoveryToken });
    await recovery.save();
    const output = `
    <div style="max-width:600px; margin:0 auto; color:rgba(255, 255, 255, 0.897); padding:10px; border-radius:15px; background:#1a1b1f;">
    <h2 style="display:inline-block; padding:10px; border-radius:10px; background-color: #2876f9; background-image: linear-gradient(315deg, #2876f9 30%, #6d17cb 74%); color:rgba(255, 255, 255, 0.897)">Hello, ${user.name}!</h2>
    <div style="font-size:20px;">
    <h4>You have requested to recover the password.</h4>
    <p>Follow the link to continue. The link is active for <span style="color:red;">5 minutes</span></p>
    <a href="http://192.168.137.1:3000/recoverpassword/${code}">Follow the link</a>
    </div>
    </div>
  `;
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.get('email'),
        pass: config.get('emailPassword'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: '"RecoFun" <' + config.get('email') + '>',
      to: email,
      subject: 'Password recover',
      text: '',
      html: output,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      res.status(200).json({ message: 'Email confirmed' });
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});
router.get('/:code', async (req, res) => {
  try {
    const code = await Recovery.findOne({ code: req.params.code });
    if (!code) {
      return res.status(404).json({ message: 'Code expired or doesn`t exist' });
    }
    res
      .status(200)
      .cookie('recoverToken', code.recoveryToken, {
        maxAge: 86400000,
        httpOnly: true,
      })
      .json({ message: 'Success' });
  } catch (e) {
    res.status(500).json({ message: 'Server error, something went wrong' });
  }
});
router.post('/recoverpassword', async (req, res) => {
  try {
    const { password } = req.body;
    console.log({ password });
    const { recoverToken } = req.cookies;
    if (!recoverToken) {
      return res.status(401).json({ message: 'Failed authorization' });
    }
    console.log({ recoverToken });
    const decoded = jwt.verify(recoverToken, config.get('jwtSecret'));
    console.log({ decoded });
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: 'Such user doesn`t exist' });
    }
    const hashedPassword = await bcrypt.hash(password, 15);
    user.password = hashedPassword;
    await user.save();
    res
      .clearCookie('recoverToken')
      .json({ message: 'Password changed successfuly' });
  } catch (e) {
    res.status(500).json({ message: 'Server error, something went wrong' });
  }
});

module.exports = router;
