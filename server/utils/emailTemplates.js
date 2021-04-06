const recoveryEmail = (userName, code) =>
  `
    <div style="max-width:600px; margin:0 auto; color:rgba(255, 255, 255, 0.897); padding:10px; border-radius:15px; background:#1a1b1f;">
    <h2 style="display:inline-block; padding:10px; border-radius:10px; background-color: #2876f9; background-image: linear-gradient(315deg, #2876f9 30%, #6d17cb 74%); color:rgba(255, 255, 255, 0.897)">Hello, ${userName}!</h2>
    <div style="font-size:20px;">
    <h4>You have requested to recover the password.</h4>
    <p>Follow the link to continue. The link is active for <span style="color:red;">5 minutes</span></p>
    <a href="http://192.168.137.1:3000/recoverpassword/${code}">Follow the link</a>
    </div>
    </div>
  `;

module.exports = {
  recoveryEmail,
};
