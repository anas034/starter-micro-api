const jwt = require('jsonwebtoken')
const user_access_refresh_tokens = require('../../../models/tokens/generateTokens')
const { user_tokens_expires_in } = require('../../../utils/common')


const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY



const renewAccessToken = async (req, res) => {

    const { data } = req.body
    const authorization_headers = req.headers.authorization

    if (!authorization_headers) {
        return res.status(401).json({ success: false, message: 'Token not found' })
    }

    try {
        const headers_token = authorization_headers.split(' ')[1]


        if (headers_token === 'null') {
            return res.status(401).send({ success: false, message: "Access token not found in headers" })
        }


        if (!data || data === 'null') {
            return res.status(401).send({ success: false, message: "Refresh token not found in body" })
        }

        const { user, exp } = jwt.decode(data)


        const userData = {
            user: {
                id: user.id
            }
        }

        const new_access_token = jwt.sign(userData, ACCESS_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.access_user_tokens_expires_in })
        const new_refresh_token = jwt.sign(userData, REFERESH_TOKEN_SECRET_KEY, { expiresIn: user_tokens_expires_in.refresh_user_tokens_expires_in })

        let find_tokens = await user_access_refresh_tokens.findOne({ refresh_token: data, access_token: headers_token })

        if (!find_tokens) {
            return res.status(401).json({ success: false, message: 'Refresh or Access Token is not valid' })
        }

        const { access_token, refresh_token, _id } = find_tokens


        const IsExpired = Date.now() >= exp * 1000
        if (IsExpired) {
            return res.status(401).json({ success: false, message: 'Refresh Token is Expired' })
        }

        let updated_tokens = await user_access_refresh_tokens.findByIdAndUpdate(_id, { access_token: new_access_token, refresh_token: new_refresh_token, renew_token: true }, { new: true })
        return res.json({ success: true, renew_access_token: updated_tokens.access_token, renew_refresh_token: updated_tokens.refresh_token })



    } catch (error) {
        return res.status(200).json({ success: false, message: 'something went wrong', error })
    }


}

module.exports = renewAccessToken


