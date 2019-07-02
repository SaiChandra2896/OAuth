const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema
const UserSChema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmation: {
    type: Boolean,
    default: false
  },
  random: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSChema);

module.exports = User;