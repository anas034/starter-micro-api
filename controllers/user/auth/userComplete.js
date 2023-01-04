const User = require("../../../models/user/User");
const Userprofile = require("../../../models/user/userCompleteProfile")
const cloudinary = require('cloudinary').v2;



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
});

const UserCOMPLETE = async (req, res) => {

    const { userId, tokenId } = req

    const { firstName, lastName, permanentAddress, phoneNumber, parentNumber, dateOfBirth, lastQualification, gender, fatherName } = req.body

    const file = req.files?.image ? req.files.image : null



    // res.json(file)

    try {
        if (!file) {
            res.status(401).send({ success: false, message: 'Profile image not found' })
            return
        }

        const find_profile = await Userprofile.findOne({ owner: userId })
        const user_data = await User.findById(userId)

        if (find_profile && !user_data.completeProfile) {
            await User.findByIdAndUpdate(userId, { completeProfile: true })
            res.status(402).send({ success: false, message: 'User profile is already completed!' })
            return
        }
        if (find_profile && user_data.completeProfile) {
            res.status(402).send({ success: false, message: 'User profile is already completed!' })
            return
        }

        if (!firstName || !lastName || !permanentAddress || !phoneNumber || !parentNumber || !dateOfBirth || !lastQualification || !gender || !fatherName) {
            return res.status(401).send({ success: false, message: 'Please provide all required fields!' })
        }
        cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {

            const save_user_profile = await Userprofile.create({
                owner: userId,
                fatherName,
                firstName: firstName,
                lastName: lastName,
                email: user_data.email,
                cnic: user_data.cnic,
                permanentAddress: permanentAddress,
                phoneNumber: phoneNumber,
                parentNumber: parentNumber,
                dateOfBirth: dateOfBirth,
                lastQualification: lastQualification,
                gender,
                completeProfile: true,
                image: result.url
            })
            await User.findByIdAndUpdate(userId, { completeProfile: save_user_profile.completeProfile })
            return res.status(200).send({ success: true, message: 'profile completed successfully!', data: save_user_profile })
        })

    } catch (error) {
        return res.status(401).send({ success: false, message: 'something went wrong' })

    }

}


module.exports = UserCOMPLETE