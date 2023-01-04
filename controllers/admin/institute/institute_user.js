const createInstitute = require("../../../models/institute/institute")
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const { send_credentials_email } = require("../../../utils/email_transport_config");
const { createIndexes } = require("../../../models/institute/institute");
const institute_User = require("../../../models/institute_management_model/institute_management");




const create_institute_user = async (req, res) => {

    const { admin_profile_id, tokenId, body } = req

    const { institute_id, username, password, email } = body

    const is_valid_id = ObjectId.isValid(body.institute_id)


    if (!institute_id || !username || !password || !email) {
        return res.status(400).send({ success: false, message: 'Please fill all the fields are required!' })
    }


    try {

        if (!is_valid_id) {
            return res.status(402).send({ success: false, message: "Invalid institute id" })
        }


        const find_institute_user = await institute_User.findOne({ username: body.username })
        const find_institute_user_by_email = await institute_User.findOne({ email: body.email })
        const find_institute = await createInstitute.findById(body.institute_id)

        if (find_institute_user) {
            return res.status(500).send({ success: false, message: "Username should be unique!" })
        }
        if (find_institute_user_by_email) {
            return res.status(500).send({ success: false, message: "User with this email already exist!" })
        }

        if (!find_institute) {
            return res.status(500).send({ success: false, message: "No institute found!" })
        }


        const salt = await bcrypt.genSalt(10)
        const password_bcrypt = await bcrypt.hash(password, salt)



        await send_credentials_email({ username, email, password })
        const create_user = await institute_User.create({
            creator_id: admin_profile_id,
            institute_id,
            username,
            email,
            password: password_bcrypt
        })

        const data = {
            creator_id: create_user.creator_id,
            institute_id: create_user.institute_id,
            username: create_user.username,
            email: create_user.email
        }

        res.status(200).send({ success: true, message: 'User Successfully Registered' })
        return

    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }

}

const get_all_institute_management_users = async (req, res) => {

    const { admin_profile_id, tokenId } = req



    try {
        const find_institute_users = await institute_User.find({})

        let users_array = []


        for (let index = 0; index < find_institute_users.length; index++) {

            const { institute_id } = find_institute_users[index]

            const find_institute = await createInstitute.findById(institute_id)
            find_institute_users[index].institute_id = undefined


            const element = {
                ...find_institute_users[index].toObject(),
                institute_details: find_institute
            }

            users_array.push(element)
        }
        res.status(200).send({ success: true, data: users_array, message: 'User Successfully Registered' })
        return

    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }

}



const edit_institute_management_user_details = async (req, res) => {

    const { admin_profile_id, tokenId, body } = req

    const { username, institute_id, email } = body
    const { id } = req.params

    const obj = {
        ...body
    }

    try {

        const is_valid_id = ObjectId.isValid(id)

        if (!is_valid_id) {
            return res.status(402).send({ success: false, message: `Invalid id` })
        }

        const find_institute_users = await institute_User.findById(id)

        if (!find_institute_users) {
            return res.status(402).send({ success: false, message: `Invalid management user id` })
        }
        const find_institute = await createInstitute.findById(find_institute_users.institute_id)

        if (obj.password) {
            obj.password = undefined
        }
        if (obj.username) {
            obj.username = undefined
        }

        const update_details = await institute_User.findByIdAndUpdate(id, {
            ...obj
        }, { new: true })

        update_details.institute_id = undefined


        update_details.password = undefined

        res.status(200).send({ success: true, data: { ...update_details.toObject(), institute_details: find_institute }, message: 'User Successfully Registered' })
        return

    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }

}




const remove_institute_management_user = async (req, res) => {

    const { admin_profile_id, tokenId } = req

    const { id } = req.params



    try {

        const is_valid_id = ObjectId.isValid(id)

        if (!is_valid_id) {
            return res.status(402).send({ success: false, message: `Invalid id` })
        }

        const find_institute_users = await institute_User.findById(id)

        if (!find_institute_users) {
            return res.status(402).send({ success: false, message: `Invalid management user id` })
        }
        const remove_institute_user = await institute_User.findByIdAndDelete(id)

        res.status(200).send({ success: true, data: { id: remove_institute_user._id }, message: 'User Successfully removed' })
        return

    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }

}



module.exports = { create_institute_user, get_all_institute_management_users, edit_institute_management_user_details, remove_institute_management_user }