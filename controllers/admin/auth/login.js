const Admin = require("../../../models/admin/admin");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const admin_access_refresh_tokens = require("../../../models/admin/adminToken");
const { validationResult } = require("express-validator");
const { admin_tokens_expires_in } = require("../../../utils/common");


const REFERESH_TOKEN_SECRET_KEY = process.env.REFERESH_TOKEN_SECRET_KEY
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY




const login = async (req, res) => {

    const { email, password } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // check whether the Admin with the same email exist already 
    let admin = await Admin.findOne({ email: req.body.email })

    try {
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Please login with correct credentials!' })
        }


        const passwordCompare = await bcrypt.compare(password, admin.password)



        if (!passwordCompare) {
            return res.status(404).json({
                success: false,
                message: 'Please try to login with correct credentials!'
            })
        }


        const data = {
            admin: {
                id: admin.id
            }
        }

        const refresh_token = jwt.sign(data, REFERESH_TOKEN_SECRET_KEY, { expiresIn: admin_tokens_expires_in.refresh_tokens_expires_in })
        const access_token = jwt.sign(data, ACCESS_TOKEN_SECRET_KEY, { expiresIn: admin_tokens_expires_in.access_tokens_expires_in })

        const login_tokens = await admin_access_refresh_tokens.create({
            owner: admin._id,
            refresh_token: refresh_token,
            access_token: access_token,
        })

        return res.status(200).json({
            message: 'Logged In Successfully!',
            tokens: { refresh_token: login_tokens.refresh_token, access_token: login_tokens.access_token },
            role: admin.role,
            success: true
        })




    } catch (error) {
        console.error(error.message)
        return res.status(500).send('something went wrong!')
    }
}



module.exports = login