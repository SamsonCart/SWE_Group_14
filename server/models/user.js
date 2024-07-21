const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    firstname: String,
    lastname: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    createdTime: {
      type: Date,
      required: true,
      default: +new Date()
    },
    authCode: {
      type: String,
      required: false
    }
  })
);

module.exports = User;