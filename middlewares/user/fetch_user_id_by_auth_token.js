const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user_access_refresh_tokens = require('../../models/tokens/generateTokens')

// const USER_AUTH_TOKEN_SECRET_KEY = process.env.USER_AUTH_TOKEN_SECRET_KEY
const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY

const fetch_user_id_by_auth_token = async (req, res, next) => {

    const userToken = req.headers.authorization

    if (!userToken) {
        return res.json({ success: false, message: 'Token should be passed in headers' })
    }
    try {
        const jwt_access_Token = userToken.split(" ")[1]

        if (jwt_access_Token === 'null') {
            return res.status(401).send({ success: false, message: "Access token not found in headers" })
        }
        const { exp, user } = jwt.decode(jwt_access_Token)

        const IsExpired = Date.now() >= exp * 1000

        if (IsExpired) {
            return res.status(401).json({ success: false, message: 'Token is Expired' })
        } else {
            const checkUserTokensInDB = await user_access_refresh_tokens.find({ owner: user.id })

            if (checkUserTokensInDB.length) {

                const { owner, refresh_token, access_token, _id: tokensNodeId } = checkUserTokensInDB[0]
                if (!access_token === jwt_access_Token) {
                    res.status(401).send({ success: false, message: "Token is not valid" })
                    return
                }
                req.userId = user.id
                req.tokenId = tokensNodeId
                next()
                return
            }
            else {
                return res.status(401).send({ success: false, message: "Token is not valid" })
            }

        }
    } catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }
}


module.exports = fetch_user_id_by_auth_token;