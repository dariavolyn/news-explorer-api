require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
const auth = require('./middlewares/auth');
const articlesRouter = require('./routes/articles');
const userRouter = require('./routes/user');
const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(requestLogger);

app.post('/api/signup', celebrate({
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
