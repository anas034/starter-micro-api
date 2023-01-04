const createBatch = require('../../../models/courses/createBatch')
const createCourses = require('../../../models/courses/createCourse')
const createInstitute = require('../../../models/institute/institute')
const institute_User = require('../../../models/institute_management_model/institute_management')
const userAdmission = require('../../../models/user/userAdmission')
const Userprofile = require('../../../models/user/userCompleteProfile')


const search_user_admission = async (req, res) => {

    // try {
    const { institute_user_id, tokenId, body } = req

    const { course_batch_id, end_roll_number } = body

    const find_batch = await createBatch.findById(course_batch_id)

    const institute_user_data = await institute_User.findById(institute_user_id)


    const find_institute = await createInstitute.findById(institute_user_data.institute_id)

    const { city, course_id } = find_batch
    const find_course = await createCourses.findById(course_id)

    const city_first_letter = city.toUpperCase().slice(0, 1)
    const institute_shortCode = find_institute.shortCode
    const course_shortCode = find_course.shortCode

    const roll_number = `${city_first_letter}${institute_shortCode}${course_shortCode}${end_roll_number}`


    const find_admission = await userAdmission.findOne({ rollNumber: roll_number })

    if (!find_admission) {
        return res.status(402).send({ success: false, message: "No admission found" })

    }
    const user_profile = await Userprofile.findOne({ owner: find_admission.candidate_id })
    const { parentsGuardianNumber, email, cnicBform, dateofBirth, permanentAddress, lastQualification, gender, rollNumber, time_slot, phoneNumber, qr_code, fee_paid_status } = find_admission

    const data = {
        father_name: user_profile.fatherName,
        imageURl: user_profile.image,

        institute: find_institute.instituteName,
        course: find_course.title,

        batch: find_batch.batch,
        amount: find_batch.fee,

        parentsGuardianNumber,
        fullName: `${user_profile.firstName} ${user_profile.lastName}`,
        city,
        time_slot,
        phoneNumber,
        email,
        cnicBform,
        dateofBirth,
        permanentAddress,
        lastQualification,
        gender,
        qr_code,
        rollNumber,
        fee_paid_status

    }

    return res.json({ data: [data], success: true })

    // }
    // catch (error) {
    //     res.status(400).send({ error: "Something went wrong!" })
    // }
}


const update_status_to_paid = async (req, res) => {
    try {
        const { institute_user_id, tokenId } = req

        const { rollNumber } = req.params

        const find_admission = await userAdmission.findOne({ rollNumber })

        if (!find_admission) {
            return res.status(402).send({ success: false, message: "No admission found" })

        }
        if (find_admission.fee_paid_status) {
            return res.status(402).send({ success: false, message: "Fee status is already paid" })

        }

        if (find_admission.fee_paid_status) {
            return res.status(402).send({ success: false, message: "Fee status is already paid" })
        }

        const update_to_paid = await userAdmission.findByIdAndUpdate(find_admission._id, {
            paid_date_time: Date.now(),
            fee_paid_status: true
        }, { new: true })

        return res.json({ data: [update_to_paid], success: true, message: "Status updated to paid" })




    }
    catch (error) {
        return res.status(400).send({ error: "Something went wrong!" })
    }
}


module.exports = { search_user_admission, update_status_to_paid };