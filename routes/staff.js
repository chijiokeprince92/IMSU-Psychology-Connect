const express = require('express')
const router = express.Router()

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')
const staff_controllers = require('../controllers/staff_controllers')

const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// FOR STAFFSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// staff login form
router.get('/login', staff_controllers.staff_login_get)

router.post('/staffhome', staff_controllers.staff_login_post)

router.get('/staffhome', staff_controllers.staffloginRequired, staff_controllers.staff_home)

// GET Staff Profile.
router.get('/profile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_profiler)

// GET staff profile for update
router.get('/updateprofile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_update_get)

// GET staff profile for update
router.post('/updateprofile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_update_post)

router.post('/updatepics/:id', staff_controllers.staff_update_pics)

// GET a single student profile
router.get('/studentprofile/:id', staff_controllers.staffloginRequired, staff_controllers.view_student_profile)

// GET the list of students and their profiles
router.get('/studentlist', staff_controllers.staffloginRequired, staff_controllers.list_students)

// GET all 100 level students
router.get('/liststudents/:level', staff_controllers.staffloginRequired, staff_controllers.list_students_level)

// Get a single Student Result
router.get('/studentfullresults/:id', staff_controllers.staffloginRequired, staff_controllers.student_result)

// ---------------------------------------------------------------------------------------------------------------

// GET all psychology staffs
router.get('/stafflist', staff_controllers.staffloginRequired, staff_controllers.list_staffs)

// GET staff colleague profile
router.get('/colleague/:id', staff_controllers.staffloginRequired, staff_controllers.view_staff_profile)

// GET staff time table
router.get('/getschedule', staff_controllers.staffloginRequired, staff_controllers.get_schedule)

// GET 100 Courses
router.get('/getcourses/:level', staff_controllers.staffloginRequired, staff_controllers.get_courses)

// Add a new a course outline
router.post('/addcourseoutline/:id', staff_controllers.staffloginRequired, staff_controllers.add_courseoutline)

// UPDATE a course outline
router.post('/editcourseoutline/:id', staff_controllers.staffloginRequired, staff_controllers.edit_courseoutline)

// GET a particular course details
router.get('/viewcourse/:id', staff_controllers.staffloginRequired, staff_controllers.view_courses)

// GET the latest news
router.get('/getlastnews', staff_controllers.staffloginRequired, staff_controllers.get_last_news)

// GET a particular news
router.get('/getfullnews/:id', staff_controllers.staffloginRequired, staff_controllers.get_full_news)

// GET project topics
router.get('/getprojecttopics', staff_controllers.staffloginRequired, staff_controllers.get_project_topics)

// GET project topics
router.get('/getprojecttopics/:topic', staff_controllers.staffloginRequired, staff_controllers.get_project_category)

// POST a project topic
router.get('/saffuploadproject', staff_controllers.staffloginRequired, staff_controllers.upload_projects)

// Get a list of all the chats you are involved
router.get('/getconversations/:id', staff_controllers.staffloginRequired, staff_controllers.get_conversations)

// Router for student to read messages
router.get('/getmessages/:recipient', staff_controllers.staffloginRequired, staff_controllers.get_messages)

// Router for student to logout
router.post('/newconversation/:recipient', staff_controllers.staffloginRequired, staff_controllers.new_conversation)

// Staff Logout
router.get('/logout', staff_controllers.staffloginRequired, staff_controllers.staff_logout)

module.exports = router
