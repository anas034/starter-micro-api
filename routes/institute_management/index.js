const express = require('express')
const router = express.Router()
const { body } = require('express-validator');
const institute_courses_detail = require('../../controllers/institute_management/auth/institute_courses_detail');
const fetch_institute_user_id_by_auth_token = require('../../controllers/institute_management/auth/fetch_institute_user_id_by_auth_token');
const fetch_institute_user_details = require('../../controllers/institute_management/auth/fetch_user_details');
const login = require('../../controllers/institute_management/auth/login');
const logout = require('../../controllers/institute_management/auth/logout');
const renewAccessToken = require('../../controllers/institute_management/auth/renew_access_token');
const { search_user_admission, update_status_to_paid } = require('../../controllers/institute_management/auth/user_admissions');
const change_management_user_password = require('../../controllers/institute_management/auth/change_management_user_password');



router.post('/login', login)
router.post('/logout', fetch_institute_user_id_by_auth_token, logout)
router.post('/renew-token', renewAccessToken)
router.get('/institute-user-details', fetch_institute_user_id_by_auth_token, fetch_institute_user_details)
router.get('/institute-courses', fetch_institute_user_id_by_auth_token, institute_courses_detail)
router.post('/search-admission-pdf', fetch_institute_user_id_by_auth_token, search_user_admission)
router.put('/update-status-paid/:rollNumber', fetch_institute_user_id_by_auth_token, update_status_to_paid)
router.put('/change-password', fetch_institute_user_id_by_auth_token, change_management_user_password)






module.exports = router
