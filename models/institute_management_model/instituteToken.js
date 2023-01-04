const mongoose = require("mongoose");

const GenerateTokens = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute-user',
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    updated: {
        type: Boolean,
        default: false
    },
    renew_token: {
        type: Boolean,
        default: false
    }

})

const Institute_access_refresh_tokens = mongoose.model("institute-auth-Tokens", GenerateTokens)

module.exports = Institute_access_refresh_tokens