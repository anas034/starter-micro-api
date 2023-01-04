const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user_access_refresh_tokens = require('../../../models/tokens/generateTokens')
const User = require('../../../models/user/User')
const Userprofile = require('../../../models/user/userCompleteProfile')

const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY

const fetch_user_details = async (req, res) => {


    const { userId, tokenId } = req

    const user_data = await User.findById(userId).select('-password')

    try {
        if (user_data) {
            const user_Profile_data = await Userprofile.findOne({ owner: userId })
            const data = user_data
            res.status(200).send({ data, user: true, profile: user_Profile_data, success: true })

        }
        else {
            res.status(404).send({ error: "No data found!" })
        }

    }
    catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }
}


module.exports = fetch_user_details;