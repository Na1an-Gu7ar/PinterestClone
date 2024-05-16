const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  dp: {
    type: String, // Assuming dp is a URL to the user's display picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
});

userSchema.plugin(plm)

module.exports  = mongoose.model('User', userSchema);