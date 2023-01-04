const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
  cnic: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    // unique:true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
  },
  completeProfile: {
    type: Boolean,
    default: false,
    required: true
  },
  role: {
    type: String,
    default: 'student',
    required: true
  },

});

const User = mongoose.model('user', UserSchema)

User.createIndexes()
module.exports = User