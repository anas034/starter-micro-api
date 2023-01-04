const express = require('express')
const router = express.Router()
const { body } = require('express-validator');

const login = require('../../controllers/admin/auth/login');
const logout = require('../../controllers/admin/auth/logout');
const logoutAll = require('../../controllers/admin/auth/allLogout');
const signUp = require('../../controllers/admin/auth/signup');
const add_course = require('../../controllers/admin/Courses/addCourse');
const { start_new_batch, edit_batch } = require('../../controllers/admin/Courses/addBatch');
const get_batches_by_course_id = require('../../controllers/admin/Courses/get_batches_by_course_id');
const add_institute = require('../../controllers/admin/institute/institute');
const get_all_users = require('../../controllers/admin/get Student/getStudent');
const getStudentprofile = require('../../controllers/admin/get Student/getstudentProfile');
const fetch_admin_id_by_auth_token = require('../../middlewares/admin/fetch_user_id_by_auth_token');
const get_batches_by_institute_id = require('../../controllers/admin/Courses/get_batches_by_institute_id');
const getCourse = require('../../controllers/admin/Courses/getCourse ');
const { getinstitutename } = require('../../controllers/admin/institute/getInstitute');
const student_Get_Profile = require('../../controllers/admin/auth/studentProfile');
const get_all_admissions = require('../../controllers/admin/admissions/get_all_admissions');
const get_admissions_by_batch_id = require('../../controllers/admin/admissions/get_admissions_by_batch_id');
const admin_renew_access_refresh_tokens = require('../../controllers/admin/auth/admin_renew_access_refresh_tokens');
const search_admission_query_param = require('../../controllers/admin/admissions/search_admission_query_param');
const pdf_data_by_admission_id = require('../../controllers/admin/admissions/pdf_data_by_admission_id');
const { create_institute_user, get_all_institute_management_users, edit_institute_management_user_details, remove_institute_management_user } = require('../../controllers/admin/institute/institute_user');
const fetch_details_by_token = require('../../controllers/admin/auth/fetch_details_by_token');




// add Auth Routes

router.post('/register', [
    // email must be in email format
    body('email', 'enter a valid email').isEmail(),
    // password must be at least 5 chars long
    body('password', 'password must be at least 5 characters').isLength({ min: 5 }),
], signUp)

router.post('/login', login)
router.post('/logout', fetch_admin_id_by_auth_token, logout)
router.post('/logout-all-sessions', fetch_admin_id_by_auth_token, logoutAll)
router.post('/renew-token', admin_renew_access_refresh_tokens)

router.get('/admin-details', fetch_admin_id_by_auth_token, fetch_details_by_token)

// add courses Routes

router.post('/add-course', fetch_admin_id_by_auth_token, add_course)
router.post('/start-new-batch', fetch_admin_id_by_auth_token, start_new_batch)
router.post('/get-batches-by-course-id', fetch_admin_id_by_auth_token, get_batches_by_course_id)
router.get('/get-batches-by-institute-id', fetch_admin_id_by_auth_token, get_batches_by_institute_id)
router.put('/edit-batch/:id', fetch_admin_id_by_auth_token, edit_batch)


// add Institue Routes
router.post('/add-institute', fetch_admin_id_by_auth_token, add_institute)

// Get  Institute Routes

router.get('/get-all-users', fetch_admin_id_by_auth_token, get_all_users)
router.get('/getUserProfileById/:id', fetch_admin_id_by_auth_token, student_Get_Profile)
// router.get('/get-user-profles', fetch_admin_id_by_auth_token, getStudentprofile)
router.get('/get-course', fetch_admin_id_by_auth_token, getCourse)
router.get('/get-institutes', fetch_admin_id_by_auth_token, getinstitutename)


router.get('/getAllAdmissions', fetch_admin_id_by_auth_token, get_all_admissions)
router.get('/getAdmissionsByBatchId/:id', fetch_admin_id_by_auth_token, get_admissions_by_batch_id)
router.get('/search-admission', fetch_admin_id_by_auth_token, search_admission_query_param)
router.get('/admission-pdf/:id', fetch_admin_id_by_auth_token, pdf_data_by_admission_id)



router.post('/intitute-user', fetch_admin_id_by_auth_token, create_institute_user)
router.get('/intitute-users', fetch_admin_id_by_auth_token, get_all_institute_management_users)
router.put('/edit-institute-user/:id', fetch_admin_id_by_auth_token, edit_institute_management_user_details)
router.delete('/remove-institute-user/:id', fetch_admin_id_by_auth_token, remove_institute_management_user)


module.exports = router