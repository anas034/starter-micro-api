const createCourses = require("../../../models/courses/createCourse")
const cloudinary = require('cloudinary').v2;
const ObjectId = require('mongoose').Types.ObjectId;



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
});

const addCourse = async (req, res) => {
    const { title, shortCode, image } = req.body
    const { admin_profile_id, tokenId } = req
    const file = req.files?.image ? req.files.image : null
    try {
        const find_from_existing_courses = await createCourses.find({ shortCode: shortCode })
        if (find_from_existing_courses.length) {
            return res.status(402).send({ success: false, message: `Course code should be unique` })
        }

        cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {

            const create_course = await createCourses.create({
                creator_id: admin_profile_id,
                title,
                shortCode,
                image: result.url
            })
            return res.status(200).send({ success: true, message: "Course Added successfully" })
        })

    } catch (error) {
        return res.status(500).send({ success: false, message: "something went wrong" })

    }
}





const edit_course = async (req, res) => {
    const { title, shortCode, image } = req.body
    const { admin_profile_id, tokenId } = req
    const file = req.files?.image ? req.files.image : null
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

module.exports = addCourse