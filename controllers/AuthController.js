const config = require('config');
//const User = require('../dbmodels/User');
const UserRepository = require('../repository/UserRepository');
const Recovery = require('../dbmodels/Recovery');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const { sendEmail } = require('../utils/sendEmail');
const { recoveryEmail } = require('../utils/emailTemplates');
const { logger } = require('../utils/logger');
const RecoveryRepository = require('../repository/RecoveryRepository');

class AuthController {
  constructor() {
    this.User = new UserRepository();
    this.Recovery = new RecoveryRepository();

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.recoverPassword = this.recoverPassword.bind(this);
    this.verifyEmailToRecover = this.verifyEmailToRecover.bind(this);
    this.verifyRecoveryCode = this.verifyEmailToRecover.bind(this);
  }
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const candidate = await this.User.findByEmail(email);
      if (candidate) {
        return res.status(400).json({ message: 'Such user already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 15);
      this.User.createUser({ name, email, password: hashedPassword });
      res.status(201).json({ message: 'User created', success: true });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      //validate password
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass)
        return res.status(401).json({ message: 'Incorrect password' });
      //create token
      const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: false, // The cookie only accessible by the web server
      };
      res.cookie('authToken', token, options);
      res.json({
        token,
        userId: user._id,
        userName: user.name,
        email: user.email,
      });
    } catch (e) {
      logger.error(e);
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }

  async checkAuth(req, res) {
    try {
      if (!req.cookies.authtoken) {
        return res.json({ message: 'not auth' });
      }
      const decoded = jwt.verify(
        req.cookies.authtoken,
        config.get('jwtSecret')
      );
      const { name, email } = await this.User.findById(decoded.userId);
      res.json({ message: 'success', user: { name, email } });
      99;
    } catch (e) {
      logger.error({ error: e });
    }
  }

  async verifyEmailToRecover(req, res) {
    try {
      const { email } = req.body;
      const user = await this.User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Such user doesn`t exist' });
      }
      const code = shortid.generate();
      const recoveryToken = jwt.sign({ email }, config.get('jwtSecret'));
      await this.Recovery.createRecovery({ code, email, recoveryToken });
      let mailOptions = {
        emailFrom: '"RecoFun" <' + config.get('email') + '>',
        emailTo: email,
        subject: 'Password recovery',
        html: recoveryEmail(user.name, code),
      };
      sendEmail(mailOptions, (err, info) => {
        if (err) {
          res.status(500).json({
            status: 'error',
            message: err,
          });
          logger.error(error);
        } else {
          res.status(201).json({ message: 'Email confirmed' });
          logger.log('Message sent: %s', info.messageId);
        }
      });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }

  async verifyRecoveryCode(req, res) {
    try {
      const code = await this.Recovery.findByCode(req.params.code);
      if (!code) {
        return res
          .status(404)
          .json({ message: 'Code expired or doesn`t exist' });
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
  }

  async recoverPassword(req, res) {
    try {
      const { password } = req.body;
      const { recoverToken } = req.cookies;
      if (!recoverToken) {
        return res.status(401).json({ message: 'Failed authorization' });
      }
      const decoded = jwt.verify(recoverToken, config.get('jwtSecret'));
      const user = await this.User.findByEmail(decoded.email);
      if (!user) {
        return res.status(404).json({ message: 'Such user doesn`t exist' });
      }
      const hashedPassword = await bcrypt.hash(password, 15);
      await this.User.updatePassword(user._id, hashedPassword);
      res
        .clearCookie('recoverToken')
        .json({ message: 'Password changed successfuly' });
    } catch (e) {
      res.status(500).json({ message: 'Server error, something went wrong' });
    }
  }
}

module.exports.AuthController = new AuthController();
