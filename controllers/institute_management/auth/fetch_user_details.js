const createInstitute = require('../../../models/institute/institute')
const institute_User = require('../../../models/institute_management_model/institute_management')


const fetch_institute_user_details = async (req, res) => {


    const { institute_user_id, tokenId } = req

    const institute_user_data = await institute_User.findById(institute_user_id).select('-password')


    try {
        if (institute_user_data) {
            const find_institute = await createInstitute.findById(institute_user_data.institute_id)
            const { username, email, active } = institute_user_data
            const { instituteName, shortCode } = find_institute
            const data = {
                username,
                email,
                instituteName,
                shortCode,
                active,
                institute_logo: find_institute.institute_logo ? find_institute.institute_logo : null,
            }
            // const data = institute_user_data
            res.status(200).send({ data, success: true })
        }
        else {
            res.status(404).send({ error: "No data found!" })
        }

    }
    catch (error) {
        return res.status(400).send({ success: false, message: "Something went wrong!" })
    }
}


module.exports = fetch_institute_user_details;