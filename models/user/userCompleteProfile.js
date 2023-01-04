const { Mongoose, default: mongoose } = require("mongoose");


const ProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cnic: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    parentNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    completeProfile: {
        type: Boolean,
        default: false,
        required: true
    },
    lastQualification: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },


    // course: {
    //     type: String,
    //     required: true,
    // },
})


const Userprofile = mongoose.model('User_Profile', ProfileSchema)

module.exports = Userprofile
