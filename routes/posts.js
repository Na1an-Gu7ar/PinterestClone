const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone")

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
  // Assuming you want to associate each post with a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports  = mongoose.model('Post', postSchema);