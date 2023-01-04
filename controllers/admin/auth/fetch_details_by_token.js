const Admin = require("../../../models/admin/admin");


const fetch_details_by_token = async (req, res) => {
    const { admin_profile_id, tokenId } = req

    try {
        // const find_user = await Admin.findById(admin_profile_id)
        return res.status(200).send({ success: true, message: 'Valid token' })


    } catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }

}

module.exports = fetch_details_by_token