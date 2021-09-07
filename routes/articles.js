const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { createArticle, deleteArticle, getArticles } = require('../controllers/articles');

const router = express.Router();
router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    date: Joi.string().required(true),
    title: Joi.string().required(true),
    text: Joi.string().required(true),
    source: Joi.string().required(true),
    keyword: Joi.string().required(true),
    owner: Joi.string(),
    link: Joi.string().required(true),
    image: Joi.string().required(true),
  }),
}), createArticle);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
