const admin_access_refresh_tokens = require("../../../models/admin/adminToken");

const logoutAll = async (req, res) => {
    const { adminId } = req.body;
    const { admin_profile_id, tokenId } = req


    try {
        await admin_access_refresh_tokens.deleteMany({ owner: admin_profile_id })
        return res.status(200).send({ success: true, message: ' All logout successfully' })



    } catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }

}

module.exports = logoutAll