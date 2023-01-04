const { default: mongoose } = require("mongoose");

const RollNumberSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    sequence: {
        type: Number,
    },




})
const userRollNumber = mongoose.model('roll_number', RollNumberSchema)

module.exports = userRollNumber