const chalk = require('chalk');
const error = chalk.bold.red;
const success = chalk.bold.green;
const action = chalk.bold.hex('#dbab79');
const pending = chalk.bold.blue;

class Logger {
  log() {
    console.log(...arguments);
  }
  error() {
    console.log(error(...arguments));
  }
  success() {
    console.log(success(...arguments));
  }
  pending() {
    console.log(pending(...arguments));
  }
  action() {
    console.log(action(...arguments));
  }
}

module.exports.logger = new Logger();
