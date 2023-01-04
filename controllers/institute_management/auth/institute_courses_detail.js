const createBatch = require('../../../models/courses/createBatch')
const createCourses = require('../../../models/courses/createCourse')
const createInstitute = require('../../../models/institute/institute')
const institute_User = require('../../../models/institute_management_model/institute_management')


const institute_courses_detail = async (req, res) => {

    try {
        const { institute_user_id, tokenId } = req

        const institute_user_data = await institute_User.findById(institute_user_id)
        // const find_institute = await institute_User.findById(institute_user_id)
        const find_batches = await createBatch.find({ institute_id: institute_user_data.institute_id, isActive: true, isHide: false })

        let data_array = []


        for (let index = 0; index < find_batches.length; index++) {
            const data_obj = find_batches[index]

            const find_course = await createCourses.findById(data_obj.course_id)
            const find_institute = await createInstitute.findById(data_obj.institute_id)
            // data_obj.institute_id = undefined
            const { title, shortCode } = find_course

            const element = {
                _id: data_obj._id,
                title,
                shortCode,
                city: data_obj.city,
                institute_logo: find_institute.institute_logo ? find_institute.institute_logo : null,
            }
            data_array.push(element)
        }
        res.status(200).send({ data: data_array, success: true })
    }
    catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }
}


module.exports = institute_courses_detail;