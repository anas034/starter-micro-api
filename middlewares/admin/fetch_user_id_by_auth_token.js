const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../../models/admin/admin')
const admin_access_refresh_tokens = require('../../models/admin/adminToken')
const user_access_refresh_tokens = require('../../models/tokens/generateTokens')

// const USER_AUTH_TOKEN_SECRET_KEY = process.env.USER_AUTH_TOKEN_SECRET_KEY
const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY

const fetch_admin_id_by_auth_token = async (req, res, next) => {

    const admin_header_token = req.headers.authorization

    if (!admin_header_token) {
        return res.json({ success: false, message: 'Token should be passed in headers' })
    }

    const jwt_access_Token = admin_header_token.split(" ")[1]

    if (jwt_access_Token === 'null') {
        return res.status(401).send({ success: false, message: "Access token not found in headers" })
    }
    try {
        const { exp, admin } = jwt.decode(jwt_access_Token)

        const IsExpired = Date.now() >= exp * 1000

        // res.json({success:true,exp, user ,jwt_access_Token })


        const check_admin_token = await admin_access_refresh_tokens.find({ access_token: jwt_access_Token })

        if (IsExpired) {
            if (check_admin_token.length) {
                const token_id = check_admin_token[0]._id
                const delete_token_response = await admin_access_refresh_tokens.findByIdAndDelete(token_id, { new: true })
            }
            return res.status(401).json({ success: false, message: 'Token is Expired' })
        }

        if (!check_admin_token.length) {
            return res.status(401).json({ success: false, message: 'Invalid access token found in headers!' })
        }
        const token_id = check_admin_token[0]._id

        req.admin_profile_id = admin.id
        req.tokenId = token_id
        next()

        return
    } catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }
}


module.exports = fetch_admin_id_by_auth_token;