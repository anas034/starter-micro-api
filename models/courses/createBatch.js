const mongoose = require('mongoose')
const { Schema } = mongoose;

const CreateBatchSchema = new Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    institute_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute',
        // required: true
    },
    lastDate: {
        type: String,
        required: true,
    },
    fee: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    city: {
        type: String,
        // required: true
    },
    courseDuration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slots: {
        type: Array,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    isEnded: {
        type: Boolean,
        default: false,
        required: true
    },
    online: {
        type: Boolean,
        default: false,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    isHide: {
        type: Boolean,
        default: false,
        required: true
    },


});

const createBatch = mongoose.model('batches', CreateBatchSchema)

createBatch.createIndexes()

module.exports = createBatch