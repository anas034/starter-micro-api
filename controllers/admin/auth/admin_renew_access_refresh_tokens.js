const jwt = require('jsonwebtoken')
const admin_access_refresh_tokens = require('../../../models/admin/adminToken')
const user_access_refresh_tokens = require('../../../models/tokens/generateTokens')
const { admin_tokens_expires_in } = require('../../../utils/common')


const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY



const admin_renew_access_refresh_tokens = async (req, res) => {

    const { data } = req.body
    const authorization_headers = req.headers.authorization
    try {
        if (!authorization_headers) {
            return res.status(401).json({ message: 'Token not found', success: false })
        }

        const headers_token = authorization_headers.split(' ')[1]

        if (headers_token === 'null') {
            return res.status(401).send({ success: false, message: "Access token not found in headers" })
        }

        if (!data || data === 'null') {
            return res.status(401).send({ success: false, message: "Refresh token not found in body" })
        }

        const { admin, exp } = jwt.decode(data)

        let find_tokens = await admin_access_refresh_tokens.findOne({ refresh_token: data, access_token: headers_token })

        if (!find_tokens) {
            return res.status(401).json({ success: false, message: 'Token is not valid' })
        }

        const decode_data = {
            admin: {
                id: admin.id
            }
        }


        const IsExpired = Date.now() >= exp * 1000

        if (IsExpired) {
            return res.status(401).json({ success: false, message: 'Refresh Token is Expired' })
        }

        const { access_token, refresh_token, _id } = find_tokens

        const new_refresh_token = jwt.sign(decode_data, REFERESH_TOKEN_SECRET_KEY, { expiresIn: admin_tokens_expires_in.refresh_tokens_expires_in })
        const new_access_token = jwt.sign(decode_data, ACCESS_TOKEN_SECRET_KEY, { expiresIn: admin_tokens_expires_in.access_tokens_expires_in })

        const updated_tokens = await admin_access_refresh_tokens.findByIdAndUpdate(_id, { access_token: new_access_token, refresh_token: new_refresh_token, renew_token: true }, { new: true })

        return res.status(200).json({ success: true, renew_access_token: updated_tokens.access_token, renew_refresh_token: updated_tokens.refresh_token })




    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong', error })
    }


}

module.exports = admin_renew_access_refresh_tokens


