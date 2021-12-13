const Article = require('../models/article');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ data: article }))
    .catch((e) => {
      if (e.name === 'CastError') {
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

module.exports.createArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    date, image, keyword, link, source, title, text,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
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

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove({ _id: req.params.id })
    .then((article) => {
      if (article) {
        if (req.user._id === article.owner.toString()) {
          res.send({ data: article });
        } else {
          const err = new Error('Invalid data');
          err.statusCode = 403;
          next(err);
        }
      } else {
        const err = new Error('Invalid data');
        err.statusCode = 404;
        next(err);
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
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
