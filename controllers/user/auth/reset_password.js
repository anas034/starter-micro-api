const bcrypt = require('bcryptjs')
const institute_User = require('../../../models/institute_management_model/institute_management');
const verifyEmailModel = require('../../../models/tokens/varificationEmailToken');
const User = require('../../../models/user/User');
const { otp_token_request_types } = require('../../../utils/common');
const { send_OTP_email, reset_password_email } = require('../../../utils/email_transport_config');
const { generateOtp } = require('../../../utils/generate_otp');


const reset_user_password_request = async (req, res) => {

    const { email } = req.body

    const find_user = await User.findOne({ email }).select('-password')

    if (!find_user) {
        return res.status(401).send({ success: false, message: "No user found!" })
    }
    const OTP = generateOtp()
    await reset_password_email(email, OTP)
    const varificationtoken = await verifyEmailModel.create({
        owner: find_user._id,
        token: OTP,
        request_type: otp_token_request_types.RESET_PASSWORD
    })

    return res.json({ success: true, message: 'Email successfully sent with verification OTP!' })


}


const verify_reset_password_token = async (req, res) => {

    const { email, otp } = req.body

    const find_user = await User.findOne({ email }).select('-password')

    if (!find_user) {
        return res.status(401).send({ success: false, message: "No user found!" })
    }

    const find_token = await verifyEmailModel.findOne({ owner: find_user.id, request_type: otp_token_request_types.RESET_PASSWORD, token: otp.toString() })

    if (!find_token) {
        return res.status(401).send({ success: false, message: "Invalid OTP or email!" })
    }

    // await verifyEmailModel.findByIdAndDelete(find_token.id)
    return res.json({ success: true, message: "OTP Successfully verified!" })
}


const verify_token_and_create_password = async (req, res) => {

    const { email, otp, newPassword, confirmPassword } = req.body

    const find_user = await User.findOne({ email }).select('-password')

    if (!find_user) {
        return res.status(401).send({ success: false, message: "No user found!" })
    }

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required!' })
    }
    const find_token = await verifyEmailModel.findOne({ owner: find_user.id, request_type: otp_token_request_types.RESET_PASSWORD, token: otp.toString() })

    if (!find_token) {
        return res.status(401).send({ success: false, message: "Invalid OTP or email!" })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'new password and confirm password are not same!' })
    }


    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(newPassword, salt)

    const updated_pass = await User.findByIdAndUpdate(find_user.id, { password: secPass }, { new: true })
    await verifyEmailModel.findByIdAndDelete(find_token.id)

    return res.json({ success: true, message: "Password successfully updated!" })
}


module.exports = { reset_user_password_request, verify_reset_password_token, verify_token_and_create_password }