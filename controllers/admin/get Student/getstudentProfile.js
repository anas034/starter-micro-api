const Userprofile = require("../../../models/user/userCompleteProfile");




const getStudentprofile = async (req, res) => {

    const { id } = req.params
    try {
        const getStdProfile = await Userprofile.find({ owner: id })
        res.status(200).send({ success: true, data: getStdProfile })
        return

    } catch (error) {
        res.status(401).send({ success: false, message: 'something went wrong ' })
        return

    }

}


module.exports = getStudentprofile