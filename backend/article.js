const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  source: String,
  publishedAt: Date,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  votedTokens: [String]
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
