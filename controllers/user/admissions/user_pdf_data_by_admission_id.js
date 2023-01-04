const createBatch = require("../../../models/courses/createBatch");
const createCourses = require("../../../models/courses/createCourse");
const createInstitute = require("../../../models/institute/institute")
const userAdmission = require("../../../models/user/userAdmission");
const Userprofile = require("../../../models/user/userCompleteProfile");
const ObjectId = require('mongoose').Types.ObjectId;




const user_pdf_data_by_admission_id = async (req, res) => {
    try {
        const { id } = req.params
        const { userId, tokenId } = req
        const is_valid_id = ObjectId.isValid(id)

        if (!id) {
            return res.status(402).send({ success: false, message: "Admission id not found" })
        }

        if (!is_valid_id) {
            return res.status(402).send({ success: false, message: "Invalid admission id" })
        }


        const find_admission = await userAdmission.findById(id)

        if (!find_admission) {
            return res.status(402).send({ success: false, message: "No admission found" })
        }

        const is_current_user_admission = find_admission.candidate_id.equals(userId)

        if (!is_current_user_admission) {
            return res.status(402).send({ success: false, message: "No current user admission found!" })
        }

        const { candidate_id, course_batch_id } = find_admission

        const find_batch = await createBatch.findById(course_batch_id)
        const find_institute = await createInstitute.findById(find_batch.institute_id)
        const find_course = await createCourses.findById(find_batch.course_id)
        const user_profile = await Userprofile.findOne({ owner: candidate_id })


        const { city, parentsGuardianNumber, fullName, email, cnicBform, dateofBirth, permanentAddress, lastQualification, gender, rollNumber, time_slot, phoneNumber, qr_code } = find_admission


        const data = {
            father_name: user_profile.fatherName,
            imageURl: user_profile.image,

            institute: find_institute.instituteName,
            course: find_course.title,
            institute_logo: find_institute.institute_logo,

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
            rollNumber
        }

        return res.status(200).send({ success: true, data })


    } catch (error) {
        return res.status(500).send({ success: false, message: "something went wrong" })

    }

}



module.exports = user_pdf_data_by_admission_id