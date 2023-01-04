const createInstitute = require("../../../models/institute/institute")
const cloudinary = require('cloudinary').v2;



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
});





const institutename = async (req, res) => {
    const { instituteName, shortCode} = req.body
    const { admin_profile_id, tokenId } = req
    const file = req.files && req.files.image ? req.files.image : null

    const jawan_pakistan_logo  = false

    try {
        // return res.status(401).send({ success: false, file: file, message: 'Institute logo is required!' })
        if (!jawan_pakistan_logo && !file) {
            res.status(401).send({ success: false, message: 'Institute logo is required!' })
            return
        }
        const find_from_existing_institutes = await createInstitute.find({ shortCode: shortCode })

        if (find_from_existing_institutes.length) {
            res.status(402).send({ success: false, message: `Institute code should be unique` })
            return
        }

        if (!jawan_pakistan_logo) {
            cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
                const add_institute = await createInstitute.create({
                    creator_id: admin_profile_id,
                    instituteName,
                    shortCode,
                    institute_logo: result.url
                })
                res.status(200).send({ success: true, data: add_institute, message: "Institude added successfully" })
                return
            })
        }
        else {
            const add_institute = await createInstitute.create({
                creator_id: admin_profile_id,
                instituteName,
                shortCode,
                institute_logo: null,
                jawan_pakistan_logo: true

            })
            res.status(200).send({ success: true, data: add_institute, message: "Institude added successfully" })
            return

        }



    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }

}



module.exports = institutename