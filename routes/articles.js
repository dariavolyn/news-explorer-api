const express = require('express');
const isURL = require('validator/lib/isURL');
const { celebrate, Joi } = require('celebrate');
const { createArticle, deleteArticle, getArticles } = require('../controllers/articles');

const router = express.Router();

function validateUrl(string) {
  return isURL(string);
}

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    date: Joi.string().required(true),
    title: Joi.string().required(true),
    text: Joi.string().required(true),
    source: Joi.string().required(true),
    keyword: Joi.string().required(true),
    owner: Joi.string().required(true),
    link: Joi.string().required(true).custom(validateUrl),
    image: Joi.string().required(true).custom(validateUrl),
  }),
}), createArticle);

router.get('/', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
