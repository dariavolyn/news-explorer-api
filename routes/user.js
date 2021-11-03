const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getProfile } = require('../controllers/users');

const router = express.Router();

router.get('/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24),
  }),
}), getProfile);

module.exports = router;
