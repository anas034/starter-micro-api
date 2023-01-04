const { isValidObjectId } = require("mongoose");
const Admin = require("../../../models/admin/admin");
const verifyEmailModel = require("../../../models/tokens/varificationEmailToken");
// const { transportEmail } = require("../../../utils/email_transport_config");



const verifyEmail = async (req, res) => {

    const { adminId, otp } = req.body;

    if (!isValidObjectId(adminId)) {
        return res.status(400).send({ success: false, message: 'Invailed admin Id' })
    }
    const admin = await Admin.findById(adminId)
    if (!admin) {
        return res.status(400).send({ success: false, message: 'Sorry admin not found' })
    }
    if (admin.verified) {
        return res.status(400).send({ success: false, message: 'This account is already verified' })
    }
    const token = await verifyEmailModel.findOne({ owner: admin._id })
    if (!token) {
        return res.status(400).send({ success: false, message: 'admin not found' })
    }

    admin.verified = true
    await verifyEmailModel.findByIdAndDelete(token._id)
    await admin.save()

    // await transportEmail.sendMail({
    //     from: "jawantechpk@gmail.com 📧 <JAWAN PAKISTAN>",
    //     to: admin.email,
    //     subject: "JawanPakistan Student Registration Test Email",
    //     html: ` 
    //         'Email verify Successfully ',
    //         'Thanks for connecting for Us'
    //         `
    // })
    return res.status(200).send({ success: true, message: 'Admin successfully verified!' })
}



module.exports = verifyEmail