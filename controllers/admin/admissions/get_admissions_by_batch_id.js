const createBatch = require("../../../models/courses/createBatch")
const createInstitute = require("../../../models/institute/institute")
const userAdmission = require("../../../models/user/userAdmission")
const ObjectId = require('mongoose').Types.ObjectId;




const get_admissions_by_batch_id = async (req, res) => {
    try {
        const { id } = req.params
        const is_valid_id = ObjectId.isValid(id)

        if (!id) {
            return res.status(402).send({ success: false, message: "Batch id not found" })
        }
        if (!is_valid_id) {
            return res.status(402).send({ success: false, message: "Invalid Batch id" })
        }
        const find_batch = await createBatch.findById(id)

        if (!find_batch) {
            return res.status(404).send({ success: false, message: "no batch found!" })
        }
        const admissions = await userAdmission.find({ course_batch_id: id })
        return res.status(200).send({ success: true, data: admissions })
    } catch (error) {
        return res.status(500).send({ success: false, message: "something went wrong" })

    }

}



module.exports = get_admissions_by_batch_id