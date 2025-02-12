// models/Comment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  content:   { type: String, required: true },
  userId:    { type: Schema.Types.ObjectId, ref: 'User' },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  upvotes:   { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
