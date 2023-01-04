const Institute_access_refresh_tokens = require("../../../models/institute_management_model/instituteToken");


const logout = async (req, res) => {
    const { institute_user_id, tokenId } = req;
    const tokens = await Institute_access_refresh_tokens.findById(tokenId)
    try {

        if (tokens) {
            await Institute_access_refresh_tokens.findByIdAndDelete(tokens._id)
            res.status(200).send({ success: true, message: 'logout successfully' })
            return
        }
    } catch (error) {

        res.status(401).send({ success: false, message: 'something went wrong' })
        return
    }


}

module.exports = logout 