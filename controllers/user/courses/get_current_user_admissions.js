const { isObject } = require("util")
const createBatch = require("../../../models/courses/createBatch")
const createCourses = require("../../../models/courses/createCourse")
const createInstitute = require("../../../models/institute/institute")
const userAdmission = require("../../../models/user/userAdmission")


const get_current_user_admissions = async (req, res) => {

    const { userId, tokenId } = req

    let user_admissions = []

    try {
        const find_admissions = await userAdmission.find({ candidate_id: userId })
        if (find_admissions.length) {
            for (let index = 0; index < find_admissions.length; index++) {
                const batch_id = find_admissions[index].course_batch_id
                const find_batch = await createBatch.findById(batch_id)

                const find_course = await createCourses.findById(find_batch.course_id)
                const find_institute = await createInstitute.findById(find_batch.institute_id)

                delete find_admissions[index].course_batch_id

                const element = {
                    ...find_admissions[index].toObject(),
                    course_details: find_course,
                    institute_details: find_institute,
                }
                user_admissions.push(element)
            }
        }
        res.status(200).json({ success: true, data: user_admissions })
    } catch (error) {
        return res.status(401).send({ success: false, message: "something went wrong", error })

    }

}


module.exports = get_current_user_admissions