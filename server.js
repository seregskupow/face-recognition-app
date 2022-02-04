require('@tensorflow/tfjs-node');

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
const chalk = require('chalk');
const { logger } = require('./utils/logger');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '1024mb' }));
app.use(cookieParser());
app.use(express.static(__dirname + '/userImages'));

//routes

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/thirdparty', require('./routes/api.routes'));

const PORT = config.get('port') || 5000;
async function start() {
  try {
    await mongoose.connect(config.get('connectURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.use('/api/db', require('./routes/mongoDB.route'));

    app.use('/api/recognition', require('./routes/recognition.route'));
    if (process.env.NODE_ENV === 'production') {
      app.use('/', express.static(path.join(__dirname, 'client', 'build')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
      });
    }
    logger.action('Connected to mongo');
    app.listen(PORT, function () {
      console.log(chalk.black.bgGreen(`App listening on port ${PORT}!`));
    });
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}
start();
