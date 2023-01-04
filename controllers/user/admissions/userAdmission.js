const generateRollNumber = require("../../../middlewares/user/generateRollNumber/index")
const createBatch = require("../../../models/courses/createBatch")
const createCourses = require("../../../models/courses/createCourse")
const createInstitute = require("../../../models/institute/institute")
const User = require("../../../models/user/User")
const userAdmission = require("../../../models/user/userAdmission")
const Userprofile = require("../../../models/user/userCompleteProfile")
const cloudinary = require('cloudinary').v2;
var QRCode = require('qrcode')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
});



const userAdmissions = async (req, res) => {
    const { city, course_batch_id, time_slot, phoneNumber, parentsGuardianNumber, permanentAddress, lastQualification } = req.body
    const { roll_number, user_profile, user_data } = req.user
    const { userId, tokenId, other_details } = req

    try {

        const { course_details, institute_details, batch_details } = other_details

        QRCode.toDataURL(roll_number, (err, url) => {


            cloudinary.uploader.upload(url, async (err, result) => {

                const create_admission = await userAdmission.create({
                    candidate_id: userId,
                    email: user_profile.email,
                    cnicBform: user_profile.cnic,
                    gender: user_profile.gender,
                    dateofBirth: user_profile.dateOfBirth,
                    fullName: `${user_profile.firstName} ${user_profile.lastName}`,
                    course_batch_id: course_batch_id,
                    city: city,
                    time_slot: time_slot,
                    // parentsGuardianName: parentsGuardianName,
                    phoneNumber,
                    parentsGuardianNumber: parentsGuardianNumber,
                    permanentAddress: permanentAddress,
                    lastQualification: lastQualification,
                    rollNumber: roll_number,
                    qr_code: result.url
                })
                const pdf_data = {
                    admission_id:create_admission._id,
                    email: user_profile.email,
                    father_name: user_profile.fatherName,
                    imageURl: user_profile.image,
                    institute: institute_details.instituteName,
                    course: course_details.title,

                    batch: batch_details.batch,
                    amount: batch_details.fee,

                    parentsGuardianNumber,
                    fullName: `${user_profile.firstName} ${user_profile.lastName}`,
                    city,
                    time_slot,
                    phoneNumber,
                    cnicBform: user_profile.cnic,
                    gender: user_profile.gender,
                    dateofBirth: user_profile.dateOfBirth,
                    permanentAddress,
                    lastQualification,
                    qr_code: result.url,
                    rollNumber: roll_number
                }

                return res.status(200).send({ success: true, message: 'Enrolled Successfully!', data: pdf_data })
            })


        })

    } catch (error) {
        return res.status(500).send({ success: false, message: "something went wrong" })


    }

}

module.exports = userAdmissions
