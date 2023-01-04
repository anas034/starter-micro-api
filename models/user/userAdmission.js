const { default: mongoose } = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    course_batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'batches',
        required: true
    },
    // available in user profile
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cnicBform: {
        type: String,
        required: true
    },
    dateofBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    // available in user profile but user can provide updated
    city: {
        type: String,
        required: true
    },

    time_slot: {
        type: String,
        required: true
    },

    // parentsGuardianName: {
    //     type: String,
    //     required: true
    // },

    parentsGuardianNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },

    permanentAddress: {
        type: String,
        required: true
    },
    lastQualification: {
        type: String,
        required: true
    },

    rollNumber: {
        type: String,
        required: true
    },
    fee_paid_status: {
        type: Boolean,
        required: true,
        default: false
    },
    qr_code: {
        type: String,
        required: true,
    },
    paid_date_time: {
        type: Date,
    },




})
const userAdmission = mongoose.model('useradmission', AdmissionSchema)

module.exports = userAdmission