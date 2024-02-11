const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!!!'],
  },
  email: {
    type: String,
    required: [true, 'A use must have Email!!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Use a valid Email!!1'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Provide a password!1'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm the password'],
    validate: {
      // This only works on Create and Save!!!
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
