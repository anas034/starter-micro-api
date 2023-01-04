const express = require('express')
const router = express.Router()
const { body } = require('express-validator');
const signUp = require('../../controllers/user/auth/signup')
const login = require('../../controllers/user/auth/login')
const logout = require('../../controllers/user/auth/logout')
const verifyEmail = require('../../controllers/user/auth/verifyEmail')
const renewAccessToken = require('../../controllers/user/auth/renew_access_token');
const UserCOMPLETE = require('../../controllers/user/auth/userComplete');
const userAdmissions = require('../../controllers/user/admissions/userAdmission');
const generate_roll_number = require('../../middlewares/user/generateRollNumber/index');
const fetch_user_id_by_auth_token = require('../../middlewares/user/fetch_user_id_by_auth_token');
const fetch_user_details = require('../../controllers/user/auth/fetch_user_details');
const get_all_courses = require('../../controllers/user/courses/get_all_courses');
const get_current_user_admissions = require('../../controllers/user/courses/get_current_user_admissions');
const user_pdf_data_by_admission_id = require('../../controllers/user/admissions/user_pdf_data_by_admission_id');
const edit_user_profile = require('../../controllers/user/auth/edit_user_profile');
const change_user_password = require('../../controllers/user/auth/change_user_password');
const { verify_reset_password_token, reset_user_password_request, verify_token_and_create_password } = require('../../controllers/user/auth/reset_password');



router.post('/register', [
    // email must be in email format
    body('email', 'enter a valid email').isEmail(),
    // name must be at least 3 chars long
    body('cnic', 'enter a valid cnic').isNumeric(),
    // password must be at least 5 chars long
    body('password', 'password must be at least 5 characters').isLength({ min: 5 }),
], signUp)

router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', fetch_user_id_by_auth_token, verifyEmail)
router.post('/renew-token', renewAccessToken)
router.post('/complete-profile', fetch_user_id_by_auth_token, UserCOMPLETE)
router.get('/user-details', fetch_user_id_by_auth_token, fetch_user_details)


// add Admission Routes
router.post('/admission', fetch_user_id_by_auth_token, generate_roll_number, userAdmissions)
router.get('/user-admissions', fetch_user_id_by_auth_token, get_current_user_admissions)
router.get('/admission-pdf/:id', fetch_user_id_by_auth_token, user_pdf_data_by_admission_id)

// courses
router.get('/getAllCourses', fetch_user_id_by_auth_token, get_all_courses)
router.put('/edit-profile', fetch_user_id_by_auth_token, edit_user_profile)


router.put('/change-password', fetch_user_id_by_auth_token, change_user_password)


router.post('/reset-password-request', reset_user_password_request)
router.post('/verify-reset-password-token', verify_reset_password_token)
router.post('/resolve-reset-password-request', verify_token_and_create_password)

// router.post('/roll-number', generateRollNumber)




















module.exports = router
