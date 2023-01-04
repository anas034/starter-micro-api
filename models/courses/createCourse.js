const mongoose = require('mongoose')
const { Schema } = mongoose;

const CreateCourseSchema = new Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
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




});

const createCourses = mongoose.model('courses', CreateCourseSchema)

createCourses.createIndexes()

module.exports = createCourses