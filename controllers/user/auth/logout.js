const user_access_refresh_tokens = require("../../../models/tokens/generateTokens");


const logout = async (req, res) => {
    const { userId } = req.body;


    const user = await user_access_refresh_tokens.findById(userId)

    const token = await user_access_refresh_tokens.findOne(user)
    try {

        if (token) {
            await user_access_refresh_tokens.findByIdAndDelete(token._id)
            res.status(200).send({ success: true, message: 'logout successfully' })
            return
        }
    } catch (error) {

        res.status(401).send({ success: false, message: 'something went wrong' })
        return
    }


}

module.exports = logout 