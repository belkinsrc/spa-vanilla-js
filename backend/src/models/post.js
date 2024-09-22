const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
