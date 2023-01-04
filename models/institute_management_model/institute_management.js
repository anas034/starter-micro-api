const mongoose = require('mongoose')
const { Schema } = mongoose;

const InstituteSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true
  },
  institute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institute',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'institute'
  }


});

const institute_User = mongoose.model('institute-user', InstituteSchema)
module.exports = institute_User