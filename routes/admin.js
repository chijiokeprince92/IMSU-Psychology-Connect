const express = require('express')
const router = express.Router()
const newsproject = require('../news_project')
const projectmulter = require('../project_multer')

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')

const admin_controllers = require('../controllers/admin_controllers')

// -------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// FOR ADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.get('/x2f4hjks8xmn', admin_controllers.admin_signup_get)

router.post('/x2f4hjks8xmn', admin_controllers.admin_signup_post)

router.get('/login', admin_controllers.admin_login_get)

router.post('/hercules', admin_controllers.admin_login_post)

router.get('/hercules', admin_controllers.admin_session_force, admin_controllers.admin)

router.get('/profile/:id', admin_controllers.admin_session_force, admin_controllers.profiler)
// GET admin profile for update
router.get('/updateprofile/:id', admin_controllers.admin_session_force, admin_controllers.admin_update_get)

// POST admin profile for update
router.post('/updateprofile/:id', admin_controllers.admin_session_force, admin_controllers.admin_update_post)

// GET the List of All the Students in Psychology
router.get('/studentlist', admin_controllers.admin_session_force, admin_controllers.list_students)

router.get('/liststudents/:level', admin_controllers.admin_session_force, admin_controllers.list_students_level)

router.get('/studentprofile/:id', admin_controllers.view_student_profile)

router.post('/makecourserep/:id', admin_controllers.admin_session_force, admin_controllers.student_make_courserep)

router.post('/enablestudent/:id', admin_controllers.admin_session_force, admin_controllers.enable_student)

router.post('/disablestudent/:id', admin_controllers.admin_session_force, admin_controllers.disable_student)

router.post('/deletestudent/:id', admin_controllers.admin_session_force, admin_controllers.delete_student)

// GET routes for editing the general details of all levels
router.get('/editlevelinfo', admin_controllers.admin_session_force, admin_controllers.edit_level_info)

// GET routes for editing the general details of 100 level
router.get('/edit100levelinfo', admin_controllers.admin_session_force, admin_controllers.edit_100level_info)

// GET routes for editing the general details of 200 level
router.get('/edit200levelinfo', admin_controllers.admin_session_force, admin_controllers.edit_200level_info)

// GET routes for editing the general details of 300 level
router.get('/edit300levelinfo', admin_controllers.admin_session_force, admin_controllers.edit_300level_info)

// GET routes for editing the general details of 400 level
router.get('/edit400levelinfo', admin_controllers.admin_session_force, admin_controllers.edit_400level_info)

// GET the number of registered staffs
router.get('/stafflist', admin_controllers.admin_session_force, admin_controllers.list_staffs)

// view staff profile
router.get('/staffprofile/:id', admin_controllers.admin_session_force, admin_controllers.view_staff_profile)

// enable staff
router.post('/enablestaff/:id', admin_controllers.admin_session_force, admin_controllers.enable_staff)

// disable staff
router.post('/disablestaff/:id', admin_controllers.admin_session_force, admin_controllers.disable_staff)

// delete staff profile and all details
router.post('/deletestaff/:id', admin_controllers.admin_session_force, admin_controllers.delete_staff)

router.get('/studentaddresult/:id', admin_controllers.admin_session_force, admin_controllers.student_addresult_get)

router.post('/studentaddresult/:id', admin_controllers.admin_session_force, admin_controllers.student_addresults_post)

// Get a single Student Result
router.get('/studentfullresults/:id', admin_controllers.admin_session_force, admin_controllers.my_result)

// Get all the Results
router.get('/viewallresults', admin_controllers.admin_session_force, admin_controllers.view_all_results)

// Delete a particular Results
router.post('/deleteresult/:stud/:id', admin_controllers.admin_session_force, admin_controllers.delete_result)

// GET form to upload project topic
router.get('/getprojectform', admin_controllers.admin_session_force, admin_controllers.get_upload_project)

// POST form to upload project topic
router.post('/getprojectform', admin_controllers.admin_session_force, projectmulter, admin_controllers.post_upload_project)

// GET all project topics
router.get('/getprojecttopicss', admin_controllers.admin_session_force, admin_controllers.get_project_topics)

// GET project by category
router.get('/getprojecttopics/:topic', admin_controllers.admin_session_force, admin_controllers.get_project_category)

// Edit project topic
router.get('/editproject/:id', admin_controllers.admin_session_force, admin_controllers.edit_project_get)

router.post('/editproject/:id', admin_controllers.admin_session_force, admin_controllers.edit_project_post)

// Delete Project topic
router.post('/deleteproject/:id', admin_controllers.admin_session_force, admin_controllers.delete_project)

// Router for course rep to add time table
router.get('/regtimetable', admin_controllers.admin_session_force, admin_controllers.register_timetable)

// Router for course rep to add time table
router.post('/regtimetable', admin_controllers.admin_session_force, admin_controllers.register_timetable_post)

// Router for course rep to post new timetable
router.post('/savetimetable', admin_controllers.admin_session_force, admin_controllers.post_time_table)

// GET and POST routes for handling NEWS
router.get('/getnewsform', admin_controllers.admin_session_force, admin_controllers.get_upload_news)

router.post('/getnewsform', admin_controllers.admin_session_force, newsproject, admin_controllers.post_upload_news)

router.get('/getlastnews', admin_controllers.admin_session_force, admin_controllers.get_last_news)

router.get('/getfullnews/:id', admin_controllers.admin_session_force, admin_controllers.get_full_news)

router.post('/comments/:id', admin_controllers.admin_session_force, admin_controllers.post_comment_news)

router.get('/editnews/:id', admin_controllers.admin_session_force, admin_controllers.news_edit_get)

router.post('/editnews/:id', admin_controllers.admin_session_force, admin_controllers.news_edit_post)

router.post('/deletenews/:id', admin_controllers.admin_session_force, admin_controllers.delete_news)

// GET Courses and Courses Form
router.get('/getcourseform', admin_controllers.admin_session_force, admin_controllers.add_courses)

router.post('/getcourseform', admin_controllers.admin_session_force, admin_controllers.post_course)

// GET 100 Level courses
router.get('/getcourses/:level', admin_controllers.admin_session_force, admin_controllers.get_courses_level)

// GET a particular course details
router.get('/viewcourse/:id', admin_controllers.admin_session_force, admin_controllers.view_course)

// GET a particular course details
router.get('/addcourseoutline/:id', admin_controllers.admin_session_force, admin_controllers.course_update_get)

// POST UPDATE a course outline
router.post('/addcourseoutline/:id', admin_controllers.admin_session_force, admin_controllers.course_update_post)

router.post('/editcourselecturer/:id', admin_controllers.admin_session_force, admin_controllers.edit_course_lecturer)

router.post('/deletecourselecturer/:id', admin_controllers.admin_session_force, admin_controllers.delete_course_lecturer)

router.post('/editcourse/:id', admin_controllers.admin_session_force, admin_controllers.delete_course)

router.post('/deletecourse/:id', admin_controllers.admin_session_force, admin_controllers.delete_course)

// staff signup form
router.get('/staffSignup', admin_controllers.admin_session_force, admin_controllers.staff_signup_get)

router.post('/staffSignup', admin_controllers.admin_session_force, admin_controllers.staff_signup_post)

// admin logout
router.get('/logout', admin_controllers.admin_logout)

module.exports = router
