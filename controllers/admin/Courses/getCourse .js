const createCourses = require("../../../models/courses/createCourse")




const getCourse = async (req, res) => {
    try {
        const find_from_existing_courses = await createCourses.find()

        res.status(200).send({ success: true, message: "Course Get successfully", data: find_from_existing_courses })
        return

    } catch (error) {
        res.status(500).send({ success: false, message: "something went wrong" })
        return

    }
}

module.exports = getCourse