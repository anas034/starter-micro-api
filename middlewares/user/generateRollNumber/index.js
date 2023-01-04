const createBatch = require("../../../models/courses/createBatch")
const createCourses = require("../../../models/courses/createCourse")
const createInstitute = require("../../../models/institute/institute")
const userRollNumber = require("../../../models/rollNumber")
const User = require("../../../models/user/User")
const userAdmission = require("../../../models/user/userAdmission")
const Userprofile = require("../../../models/user/userCompleteProfile")
const node_name_constant = 'auto_roll_number_generator'
const initial_count = 8000

const generate_roll_number = async (req, res,next) => {
    const { city, course_batch_id, time_slot, phoneNumber, parentsGuardianNumber, permanentAddress, lastQualification } = req.body

    if( !city || !course_batch_id || !time_slot || !phoneNumber || !parentsGuardianNumber || !permanentAddress || !lastQualification) {
        return res.status(400).send({ success: false, message: 'Please fill all the fields are required!' })
    }
    const { userId, tokenId } = req

        try {
            const find_course_batch = await createBatch.findById(course_batch_id)

        const user_data = await User.findById(userId).select('-password')

        if (!find_course_batch) {
            return res.status(400).send({ success: false, message: 'no course batch found!' })
        }

        if (!user_data.completeProfile && !user_data.verified) {
            return res.status(404).send({ success: false, message: 'Please verify email and complete your profile first!' })
        }

        if (!user_data.verified) {
            return res.status(400).send({ success: false, message: 'Please verify email first!' })
        }

        if (!user_data.completeProfile) {
            return res.status(400).send({ success: false, message: 'Please complete your profile first!' })
        }

        const find_user_admissions = await userAdmission.find({ course_batch_id, candidate_id: userId })

        if (find_user_admissions.length) {
            return res.status(409).send({ success: false, message: `You're already enrolled in this course` })
        }

        const find_course = await createCourses.findById(find_course_batch.course_id)
        const find_institute = await createInstitute.findById(find_course_batch.institute_id)


        if(!find_course){
            return res.status(404).send({ success: false, message: 'No course found corresponding to this batch' })

        }

        if(!find_institute){
            return res.status(404).send({ success: false, message: 'No institute / campus found corresponding to this batch' })

        }

        const institute_shortcode = find_institute.shortCode
        const course_shortcode = find_course.shortCode
        const city_shortcode = find_course_batch.city.slice(0, 1).toUpperCase()
        
        const student_roll_number = `${city_shortcode}${institute_shortcode}${course_shortcode}`

        const user_profile = await Userprofile.findOne({ owner: userId })
        let seqId 
        if(user_profile){
            const find_sequence =  await userRollNumber.find({ node_name: node_name_constant})

            if(find_sequence){
                // await userRollNumber.create({ node_name: node_name_constant, sequence: initial_count })
               const update_sequence =  await userRollNumber.findOneAndUpdate({ node_name: node_name_constant },{ "$inc": {"sequence": 1 } },{ new: true })

               seqId = update_sequence.sequence

               
            }
            else{
                const create_start_sequence =  await userRollNumber.create({ node_name: node_name_constant, sequence: initial_count })
                seqId = create_start_sequence.sequence
                
            }
            req.user = {
                roll_number : `${student_roll_number}${seqId}`,
                user_profile,
                user_data:user_data
            }
            req.other_details = {
               course_details :find_course,
               institute_details :find_institute,
               batch_details:find_course_batch
            }
            next()
        return 
    }
    else
    {
        return res.status(404).send({ success: false, message: 'user profile not found!' }) 
        }
            
} catch (error) {
    return res.status(400).send({ success:false, message: "Something went wrong!" })
}


}




module.exports = generate_roll_number 












// const generateRollNumber = async (req, res) => {
//     const initial_count = 8000

//     const find_sequence = await userRollNumber.findOne({ id: id_constant })
//     if (!find_sequence) {
//         const create_initial_sequence = await userRollNumber.create({
//             id: id_constant,
//             seq: 8000
//         })

//         res.send({ success: true, data: create_initial_sequence })

//         return
//     }


//     else {

//         const update_sequence = await userRollNumber.findOneAndUpdate({ id: id_constant }, { "$inc": { "seq": 1 } }, { new: true })

    
//             // let seqId;

//             // if (cd === null) {
//             //     const newval = new userRollNumber({ id: 'autoval', seq: 7000 })
//             //     res.send({ success: true })
//             //     newval.save()
//             //     seqId = 1
//             // } else {
//             //     seqId = cd.seq
//             // }
//             res.send({ success: true, data: update_sequence })
//             return
//     }



// }