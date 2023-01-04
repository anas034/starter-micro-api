const User = require("../../../models/user/User");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { send_OTP_email } = require("../../../utils/email_transport_config");
const user_access_refresh_tokens = require("../../../models/tokens/generateTokens");
const verifyEmailModel = require("../../../models/tokens/varificationEmailToken");
const { generateOtp } = require("../../../utils/generate_otp");
const { user_tokens_expires_in, otp_token_request_types } = require("../../../utils/common");



const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY




const signUp = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { cnic, email, password } = req.body

    // check whether the user with the same email exist already 
    let user_email = await User.findOne({ email: email })
    let user_cnic = await User.findOne({ cnic: cnic })

    let user = {}
    try {
        if (user_email) {
            return res.status(409).json({ success: false, message: 'This email already exist!' })
        }
        if (user_cnic) {
            return res.status(409).json({ success: false, message: 'This CNIC number already exist!' })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt)

        // create new user 
        user = await User({
            cnic: cnic,
            email: email,
            password: secPass,
        })

        // payload

        const data = {
            user: {
                id: user.id
            }
        }
        // Generate OTP 

        const OTP = generateOtp()
        await send_OTP_email(email, OTP)
        const varificationtoken = new verifyEmailModel({
            owner: user._id,
            token: OTP,
            request_type: otp_token_request_types.SIGNUP
        })


        await user.save()
        await varificationtoken.save()

        const refresh_token = jwt.sign(data, REFERESH_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.refresh_user_tokens_expires_in })
        const access_token = jwt.sign(data, ACCESS_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.access_user_tokens_expires_in })

        const tokensBoth = { refresh_token, access_token }



        userTokens = await user_access_refresh_tokens({
            owner: user._id,
            refresh_token: tokensBoth.refresh_token,
            access_token: tokensBoth.access_token
        })

        await userTokens.save()

        res.json({
            message: 'User registered successfully!',
            tokens: { refresh_token: userTokens.refresh_token, access_token: userTokens.access_token },
            verified: user.verified,
            completeProfile: user.completeProfile,
            success: true

        }).status(200)
        return


    } catch (error) {
        res.status(500).send('something went wrong!')
        return
    }
}


module.exports = signUp 