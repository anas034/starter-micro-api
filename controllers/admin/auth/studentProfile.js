const User = require('../../../models/user/User');
const Userprofile = require('../../../models/user/userCompleteProfile');


const student_Get_Profile = async (req, res) => {
    const { ownerId } = req.body

    const { id } = req.params
    try {


        const check_user = await User.findById(id)

        if (check_user && check_user.completeProfile) {
            const user_data = await Userprofile.find({ owner: id })
            if (!user_data) {
                return res.status(200).send({ success: false, message: 'no profile found!' })
            }
            return res.status(200).send({ success: true, data: user_data })
        }
        else {
            return res.status(200).send({ success: false, message: 'user profile is not completed yet!' })
        }
    } catch (error) {
        return res.status(401).send({ success: false, message: 'something went wrong' })

    }

}


module.exports = student_Get_Profile