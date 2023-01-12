require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_URL } = require('./utils/constants');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;
const { NODE_ENV, HOST_DB } = process.env;
const app = express();

const allowedCors = [
  'https://diploma.margosha.nomoredomains.club',
  'http://diploma.margosha.nomoredomains.club',
  'http://localhost:3000',
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowedCors.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: true };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? HOST_DB : DB_URL, {
  useNewUrlParser: true,
});

app.listen(PORT);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
