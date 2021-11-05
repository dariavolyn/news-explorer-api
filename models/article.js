const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const regexp = /^((http:\/\/)|(https:\/\/))(www\.)?[_~:?%#[\]@!$&'()*+,;=/-\w.]+/;
        return regexp.test(v);
      },
    },
  },
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const regexp = /^((http:\/\/)|(https:\/\/))(www\.)?[_~:?%#[\]@!$&'()*+,;=/-\w.]+\.[\w]+#?/;
        return regexp.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('article', articleSchema);
