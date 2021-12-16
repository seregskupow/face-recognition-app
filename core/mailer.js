const nodemailer = require('nodemailer');
const config = require('config');

const options = {
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
};

module.exports.mailer = nodemailer.createTransport(options);
