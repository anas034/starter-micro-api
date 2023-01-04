const createBatch = require("../../../models/courses/createBatch")
const createInstitute = require("../../../models/institute/institute")
const userAdmission = require("../../../models/user/userAdmission")
const ObjectId = require('mongoose').Types.ObjectId;




const search_admission_query_param = async (req, res) => {

    const { query } = req

    try {
        const query_key = Object.keys(query)[0]

        const query_value = query[query_key]

        const admissions = await userAdmission.find({ [query_key]: query_value })

        res.status(200).json({ success: false, data: admissions })
    } catch (error) {
        return res.status(500).send({ success: false, message: "something went wrong" })

    }

}



module.exports = search_admission_query_param