// models/ArticleHistory.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleHistorySchema = new Schema({
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ArticleHistory', articleHistorySchema);
