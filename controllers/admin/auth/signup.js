const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require("express-validator");
const verifyEmailModel = require("../../../models/tokens/varificationEmailToken");
// const { generateOtp, transportEmail } = require("../../../utils/email_transport_config");
const Admin = require('../../../models/admin/admin');
const admin_access_refresh_tokens = require('../../../models/admin/adminToken');
const { admin_tokens_expires_in } = require('../../../utils/common');



const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY


async function send(email, OTP) {

    // await transportEmail.sendMail({
    //     from: "jawantechpk@gmail.com 📧 <JAWAN PAKISTAN>",
    //     to: email,
    //     subject: "JawanPakistan Student Registration Test Email",
    //     html: `<h1>This is User ${OTP} </h1>`,

    // });


}


const signUP = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // check whether the user with the same email exist already 
    let admin = await Admin.findOne({ email: req.body.email })
    try {
        if (admin) {
            return res.status(400).json({ success: false, message: 'Email already exist!' })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        // create new admin 
        admin = await Admin.create({
            email: req.body.email,
            password: secPass,
            role: 'admin'
        })
        const data = {
            admin: {
                id: admin.id
            }
        }
        const refresh_token = jwt.sign(data, REFERESH_TOKEN_SECRET_KEY, { expiresIn: admin_tokens_expires_in.refresh_tokens_expires_in })
        const access_token = jwt.sign(data, ACCESS_TOKEN_SECRET_KEY, { expiresIn: admin_tokens_expires_in.access_tokens_expires_in })

        auth_tokens = await admin_access_refresh_tokens({
            owner: admin._id,
            refresh_token: refresh_token,
            access_token: access_token,

        })
        await auth_tokens.save()
        return res.json({
            message: 'Admin registered successfully!',
            tokens: { refresh_token: auth_tokens.refresh_token, access_token: auth_tokens.access_token },
            role: admin.role,
            success: true

        })
    }

    catch (error) {
        console.error(error.message)
        return res.status(500).send('something went wrong!')
    }
}


module.exports = signUP