const User = require("../../../models/user/User");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user_access_refresh_tokens = require("../../../models/tokens/generateTokens");
const { user_tokens_expires_in } = require("../../../utils/common");
const Userprofile = require("../../../models/user/userCompleteProfile");



const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY



const login = async (req, res) => {

    const { email, password } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // check whether the user with the same email exist already 


    let user = await User.findOne({ email: req.body.email })

    try {

        if (!user) {
            return res.status(401).json({ message: 'Please login with correct credentials!' })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)


        if (!passwordCompare) {
            return res.status(401).json({
                success: false,
                message: 'Please try to login with correct credentials!'
            })
        }


        const data = {
            user: {
                id: user.id
            }
        }


        const checkUserTokensInDB = await user_access_refresh_tokens.find({ owner: user._id })


        const refresh_token = jwt.sign(data, REFERESH_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.refresh_user_tokens_expires_in })
        const access_token = jwt.sign(data, ACCESS_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.access_user_tokens_expires_in })


        const user_Profile_data = await Userprofile.findOne({ owner: user.id })



        if (checkUserTokensInDB.length) {



            const tokensNodeId = checkUserTokensInDB[0]._id


            const updateUserTokens = await user_access_refresh_tokens.findByIdAndUpdate(tokensNodeId, {
                refresh_token: refresh_token,
                access_token: access_token,
                updated: true
            }, { new: true })



            return res.status(200).json({
                message: 'Logged In Successfully!',
                tokens: { refresh_token: updateUserTokens.refresh_token, access_token: updateUserTokens.access_token },
                verified: user.verified,
                completeProfile: user.completeProfile,
                success: true,
                profile: user_Profile_data
            })

        }

        const loginTokens = await user_access_refresh_tokens.create({
            owner: user._id,
            refresh_token: refresh_token,
            access_token: access_token,
        })

        return res.status(200).json({
            message: 'Logged In Successfully!',
            tokens: { refresh_token: loginTokens.refresh_token, access_token: loginTokens.access_token },
            verified: user.verified,
            completeProfile: user.completeProfile,
            success: true,
            profile: user_Profile_data
        })


    } catch (error) {
        console.error(error.message)
        return res.status(500).send('something went wrong!')
    }

}


module.exports = login