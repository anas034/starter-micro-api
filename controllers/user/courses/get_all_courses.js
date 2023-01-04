const { isObject } = require("util")
const createBatch = require("../../../models/courses/createBatch")
const createCourses = require("../../../models/courses/createCourse")
const createInstitute = require("../../../models/institute/institute")


const get_all_courses = async (req, res) => {

    const { userId, tokenId } = req

    const active_courses = await createBatch.find({ isActive: true, isEnded: false })
    const past_courses = await createBatch.find({ isActive: false })

    const active_courses_array = []
    const past_courses_array = []

    try {

        if (active_courses.length) {

            for (let index = 0; index < active_courses.length; index++) {

                const batch = active_courses[index]

                const find_institute = await createInstitute.findById(batch.institute_id)

                const find_course = await createCourses.findById(batch.course_id)

                const element = {
                    _id: batch._id,
                    creator_id: batch.creator_id,
                    course_details: find_course,
                    institute_details: find_institute,
                    lastDate: batch.lastDate,
                    fee: batch.fee,
                    slots: batch.slots,
                    city: batch.city,
                    courseDuration: batch.courseDuration,
                    description: batch.description,
                    isActive: batch.isActive,
                    online: batch.online,
                    batch: batch.batch,
                    date: batch.date,
                    __v: batch.__v
                }
                active_courses_array.push(element)
            }
        }
        if (past_courses.length) {
            for (let index = 0; index < past_courses.length; index++) {
                const batch = past_courses[index]
                const find_institute = await createInstitute.findById(batch.institute_id)
                const find_course = await createCourses.findById(batch.course_id)
                const element = {
                    _id: batch._id,
                    creator_id: batch.creator_id,
                    course_details: find_course,
                    institute_details: find_institute,
                    lastDate: batch.lastDate,
                    fee: batch.fee,
                    slots: batch.slots,
                    city: batch.city,
                    courseDuration: batch.courseDuration,
                    description: batch.description,
                    isActive: batch.isActive,
                    online: batch.online,
                    batch: batch.batch,
                    date: batch.date,
                    __v: batch.__v
                }
                past_courses_array.push(element)
            }



        }
        return res.send({
            success: true, active_courses:
                active_courses_array, past_courses: past_courses_array
        }).status(200)

    } catch (error) {
        return res.status(401).send({ success: false, message: "something went wrong", error })

    }


}


module.exports = get_all_courses