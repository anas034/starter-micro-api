const createBatch = require("../../../models/courses/createBatch")
const createCourses = require("../../../models/courses/createCourse")
const createInstitute = require("../../../models/institute/institute")
const ObjectId = require('mongoose').Types.ObjectId;




const start_new_batch = async (req, res) => {
    const { batchCount, course_id, lastDate, fee, institute_id, city, courseDuration, online, description, slots, isEnded, isActive } = req.body
    const { admin_profile_id, tokenId } = req


    try {
        const is_valid_course_id = ObjectId.isValid(course_id)
        const is_valid_institute_id = ObjectId.isValid(institute_id)

        if (!is_valid_course_id) {
            return res.status(402).send({ success: false, message: `invalid course id` })
        }

        if (!is_valid_institute_id) {
            return res.status(402).send({ success: false, message: `invalid institute id` })
        }

        const find_course = await createCourses.findById(course_id).select("-creator_id")
        const find_institute = await createInstitute.findById(institute_id).select("-creator_id")
        if (!find_course) {
            return res.status(402).send({ success: false, message: `no course found!` })
        }

        if (online) {
            const new_batch = await createBatch.create({
                creator_id: admin_profile_id,
                lastDate: lastDate,
                slots: slots,
                course_id,
                fee: fee,
                courseDuration: courseDuration,
                description: description,
                online,
                batch: batchCount,
                isEnded: isEnded ? isEnded : false,
                isActive: isActive ? isActive : true,
            })
            return res.status(200).send({ success: true, new_batch, message: "Batch started successfully" })

        }

        if (!find_course && !find_institute) {
            return res.status(402).send({ success: false, message: `course and institute ids are not valid!` })
        }

        if (!find_institute) {
            return res.status(402).send({ success: false, message: `no institute found!` })
        }
        const new_batch = await createBatch.create({
            creator_id: admin_profile_id,
            lastDate: lastDate,
            course_id,
            fee: fee,
            institute_id,
            city: city,
            slots: slots,
            courseDuration: courseDuration,
            description: description,
            online,
            batch: batchCount
        })
        return res.status(200).send({ success: true, message: "Batch listed successfully" })

    } catch (error) {
        return res.status(401).send({ success: false, message: "something went wrong", error })

    }



}
const edit_batch = async (req, res) => {
    const { batchCount } = req.body
    const { admin_profile_id, tokenId } = req
    const { id } = req.params

    try {
        const is_valid_id = ObjectId.isValid(id)

        if (!is_valid_id) {
            return res.status(402).send({ success: false, message: `invalid batch id` })
        }

        const find_batch = await createBatch.findById(id)
        if (!find_batch) {
            return res.status(402).send({ success: false, message: `no batch found!` })
        }

        let obj = { ...req.body }

        if (batchCount) {
            obj.batch = batchCount
        }
        const fine_batch = await createBatch.findByIdAndUpdate(id, { ...obj }, { new: true })

        res.status(200).json({ success: true, data: fine_batch, message: "Batch successfully updated!" })

    } catch (error) {
        return res.status(401).send({ success: false, message: "something went wrong", error })
    }
}

module.exports = { start_new_batch, edit_batch }