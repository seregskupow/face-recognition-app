const mailer = require('../core/mailer');

module.exports.sendEmail = (
  { emailFrom, emailTo, subject, html },
  callback
) => {
  mailer.sendMail(
    {
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: html,
    },
    callback ||
      function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
  );
};
