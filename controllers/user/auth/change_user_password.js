const bcrypt = require('bcryptjs')
const institute_User = require('../../../models/institute_management_model/institute_management');
const User = require('../../../models/user/User');



const change_user_password = async (req, res) => {

    const { userId, tokenId, body } = req
    const { oldPassword, newPassword, confirmPassword } = body

    const find_user = await User.findById(userId)

    try {
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'new password and confirm password are not same!' })
        }


        if (newPassword === oldPassword) {
            return res.status(400).json({ success: false, message: 'New Password should be different' })
        }


        const passwordCompare = await bcrypt.compare(oldPassword, find_user.password)

        if (!passwordCompare) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect!' })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(newPassword, salt)

        const updated_pass = await User.findByIdAndUpdate(userId, { password: secPass }, { new: true })

        return res.status(200).json({ success: true, message: 'Password changed successfully' })

    } catch (error) {
        console.error(error.message)
        return res.status(500).send('something went wrong!')
    }

}


module.exports = change_user_password