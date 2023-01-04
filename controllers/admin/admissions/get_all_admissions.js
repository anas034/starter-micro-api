const createInstitute = require("../../../models/institute/institute")
const userAdmission = require("../../../models/user/userAdmission")




const get_all_admissions = async (req, res) => {


    try {
        const admissions = await userAdmission.find()
        return res.status(200).send({ success: true, data: admissions })

    } catch (error) {
        return res.status(500).send({ success: false, message: "something went wrong" })

    }

}



module.exports = get_all_admissions