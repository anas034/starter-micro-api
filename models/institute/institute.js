const mongoose = require('mongoose')
const { Schema } = mongoose;

const Create_Instttute_Schema = new Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    instituteName: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    institute_logo: {
        type: String,
        // required: true,
    },
    jawan_pakistan_logo: {
        type: Boolean,
        required: true,
        default: false
    }




});

const createInstitute = mongoose.model('institute', Create_Instttute_Schema)

createInstitute.createIndexes()

module.exports = createInstitute