const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { createArticle, deleteArticle, getArticles } = require('../controllers/articles');

const router = express.Router();
router.get('/', getArticles);

router.post('/', createArticle);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
