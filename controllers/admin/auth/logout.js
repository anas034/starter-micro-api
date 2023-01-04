const admin_access_refresh_tokens = require("../../../models/admin/adminToken");




const logout = async (req, res) => {
    const { adminId } = req.body;
    const { admin_profile_id, tokenId } = req

    try {
        await admin_access_refresh_tokens.findByIdAndDelete(tokenId)
        return res.status(200).send({ success: true, message: 'logout successfully' })


    } catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }

}

module.exports = logout