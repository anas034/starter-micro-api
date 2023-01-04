const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Userprofile = require('../../../models/user/userCompleteProfile')
const cloudinary = require('cloudinary').v2;




cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
});


const edit_user_profile = async (req, res) => {


    const { userId, tokenId, body, files } = req

    const file = files ? files?.image : null

    const user_Profile_data = await Userprofile.findOne({ owner: userId })

    const profile_elements = ['dateOfBirth', 'fatherName', 'gender', 'firstName', 'lastName', 'permanentAddress', 'parentNumber', 'phoneNumber', 'lastQualification',]

    let obj = {}

    if (file) {
        const result = await cloudinary.uploader.upload(file.tempFilePath)
        obj = { ...obj, image: result.url }
    }
    Object.keys(body).forEach((element) => {
        if (profile_elements.includes(element)) {
            obj = { ...obj, [element]: body[element] }
        }
    })

    const update_profile = await Userprofile.findByIdAndUpdate(user_Profile_data.id, { ...obj }, { new: true })

    res.status(200).json({ success: false, data: update_profile, message: 'Profile successfully updated!' })


    try {





    }
    catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }
}


module.exports = edit_user_profile;