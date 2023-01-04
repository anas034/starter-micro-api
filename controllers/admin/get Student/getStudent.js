const User = require("../../../models/user/User");
const userAdmission = require("../../../models/user/userAdmission");




const get_all_users = async (req, res) => {

    const { admin_profile_id, tokenId } = req


    try {

        const all_users = await User.find({}).select('-password')

        res.status(200).send({ success: true, data: all_users })
        return

    } catch (error) {
        res.status(401).send({ success: false, message: 'something went wrong ' })
        return

    }

}



module.exports = get_all_users