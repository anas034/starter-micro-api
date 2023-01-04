const mongoose = require("mongoose");

const verifyEmailTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 36000,
        default: Date.now
    },
    request_type: {
        type: String,
        required: true
    }

})

const verifyEmailModel = mongoose.model("varificationToken", verifyEmailTokenSchema);

module.exports = verifyEmailModel