const { isObject } = require("util")
const { db } = require("../../../models/courses/createBatch")
const createBatch = require("../../../models/courses/createBatch")
const createCourses = require("../../../models/courses/createCourse")
const createInstitute = require("../../../models/institute/institute")


const get_batches_by_institute_id = async (req, res) => {

    const { institute_id } = req.body
    const { admin_profile_id, tokenId } = req

    try {

        const find_institute = await createInstitute.findById(institute_id)

        if (!find_institute) {
            res.status(404).send({ success: false, message: `course not found!` })
            return
        }

        const find_batches = await createBatch.find({ institute_id })

        if (find_batches.length) {

            let baches_array = []

            for (let index = 0; index < find_batches.length; index++) {

                const batch = find_batches[index]

                const find_course = await createCourses.findById(find_batches[index].course_id)

                const element = {
                    _id: batch._id,
                    creator_id: batch.creator_id,
                    course_details: find_course,
                    institute_details: find_institute,
                    lastDate: batch.lastDate,
                    fee: batch.fee,
                    city: batch.city,
                    courseDuration: batch.courseDuration,
                    description: batch.description,
                    isActive: batch.isActive,
                    online: batch.online,
                    batch: batch.batch,
                    date: batch.date,
                    __v: batch.__v
                }
                baches_array.push(element)
            }


            return res.send({ success: true, data: baches_array }).status(200)
        }

        return res.send({ success: true, data: [] }).status(200)




    } catch (error) {
        res.send({ success: false, message: 'something went wrong' }).status(401)

        return
    }

}


module.exports = get_batches_by_institute_id