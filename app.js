require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
const auth = require('./middlewares/auth');
const articlesRouter = require('./routes/articles');
const userRouter = require('./routes/user');
const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/daria-news-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const allowedCors = [
  'https://daria-news.students.nomoreparties.site/',
  'http://daria-news.students.nomoreparties.site/',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { referrer } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  if (allowedCors.includes(referrer)) {
    res.header('Access-Control-Allow-Origin', referrer);
  }
  next();
});

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
    username: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/articles', articlesRouter);
app.use('/users', userRouter);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Error'
        : err.message,
    });
  next();
});

app.listen(PORT);
