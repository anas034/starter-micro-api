const mongoose = require("mongoose");

const generateTokens = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
    updated:{
        type:Boolean,
        default:false
    },
    renew_token:{
        type:Boolean,
        default:false
    }

})

const user_access_refresh_tokens = mongoose.model("Refresh_Access_Tokens", generateTokens)

module.exports = user_access_refresh_tokens