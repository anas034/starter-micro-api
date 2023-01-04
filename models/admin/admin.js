const mongoose = require('mongoose')
const { Schema } = mongoose;

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // verified: {
  //   type: Boolean,
  //   default: false,
  //   required: true
  // },
  role:{
    type:String,
    required: true
  }
  

});

const Admin = mongoose.model('admin', AdminSchema)
Admin.createIndexes()
module.exports = Admin