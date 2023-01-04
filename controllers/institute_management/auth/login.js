const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { user_tokens_expires_in } = require("../../../utils/common");
const Institute_access_refresh_tokens = require('../../../models/institute_management_model/instituteToken');
const institute_User = require('../../../models/institute_management_model/institute_management');



const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY



const login = async (req, res) => {

    const { username, password } = req.body

    if (!username) {
        return res.status(401).json({ success: false, message: 'Username is required' })
    }

    if (!password) {
        return res.status(401).json({ success: false, message: 'Password is required' })
    }
    // check whether the user with the same email exist already 

    let find_institute_user = await institute_User.findOne({ username: username })


    try {
        if (!find_institute_user) {
            return res.status(401).json({ success: false, message: 'Please login with correct credentials' })
        }
        const passwordCompare = await bcrypt.compare(password, find_institute_user.password)

        if (!passwordCompare) {
            return res.status(401).json({
                success: false,
                message: 'Please try to login with correct credentials!'
            })
        }

        if (!find_institute_user.active) {
            return res.status(401).json({ success: false, message: 'Inactive user' })
        }

        if (find_institute_user.isDeleted) {
            return res.status(401).json({ success: false, message: 'Inactive user' })
        }


        const data = {
            institute_user: {
                id: find_institute_user.id
            }
        }


        const checkUserTokensInDB = await Institute_access_refresh_tokens.find({ owner: find_institute_user._id })


        const refresh_token = jwt.sign(data, REFERESH_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.refresh_user_tokens_expires_in })
        const access_token = jwt.sign(data, ACCESS_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.access_user_tokens_expires_in })


        if (checkUserTokensInDB.length) {



            const tokensNodeId = checkUserTokensInDB[0]._id


            const updateUserTokens = await Institute_access_refresh_tokens.findByIdAndUpdate(tokensNodeId, {
                refresh_token: refresh_token,
                access_token: access_token,
                updated: true
            }, { new: true })



            return res.status(200).json({
                message: 'Logged In Successfully!',
                tokens: { refresh_token: updateUserTokens.refresh_token, access_token: updateUserTokens.access_token },
                success: true,
            })

        }

        const loginTokens = await Institute_access_refresh_tokens.create({
            owner: find_institute_user._id,
            refresh_token: refresh_token,
            access_token: access_token,
        })

        return res.status(200).json({
            message: 'Logged In Successfully!',
            tokens: { refresh_token: loginTokens.refresh_token, access_token: loginTokens.access_token },
            success: true

        })


    } catch (error) {
        console.error(error.message)
        return res.status(500).send('something went wrong!')
    }

}


module.exports = login