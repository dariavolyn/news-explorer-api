const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const { email, username, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, username, password: hash,
      });
    })
    .then(() => {
      res.send({ user: email, username });
    })
    .catch((e) => {
      if (e.username === 'ValidationError') {
        const err = new Error('Invalid data');
        err.statusCode = 400;
        next(err);
      } else if (e.username === 'MongoError' || e.code === 11000) {
        const err = new Error('Email already in use');
        err.statusCode = 409;
        next(err);
      } else {
        const err = new Error('Error');
        err.statusCode = 500;
        next(err);
      }
    });
};

module.exports.getProfile = (req, res, next) => {
  User.findById({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User ID not found');
      }
      return res.send({ user });
    })
    .catch((e) => {
      if (e.username === 'CastError') {
        const err = new Error('Invalid data');
        err.statusCode = 400;
        next(err);
      } else {
        const err = new Error('Error');
        err.statusCode = 500;
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      next(err);
    });
};
