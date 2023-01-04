const createInstitute = require("../../../models/institute/institute")




const getinstitutename = async (req, res) => {


    try {
        const find_from_existing_institutes = await createInstitute.find()

        res.status(200).send({ success: true, data: find_from_existing_institutes })
        return

    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }

}





module.exports = { getinstitutename }