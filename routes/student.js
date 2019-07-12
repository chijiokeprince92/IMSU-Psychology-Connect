const express = require('express')
const router = express.Router()

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')
const controllers = require('../controllers/view_controller')
const student_controllers = require('../controllers/student_controllers')
const testing_controllers = require('../controllers/testing')

const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// ----------------------------------------------------------------------------------
router.get('/testpicture', testing_controllers.upload_files)

router.post('/testpicture', testing_controllers.post_upload_files)

router.get('/testinggetlastnews', testing_controllers.get_last_news)

router.get('/testinggetfullnews/:id', testing_controllers.get_full_news)
// 0-------------------------------------------------------------------------------------------------
/* GET home page. */
router.get('/', controllers.home)

// GET the homepage NEWSPAGE
router.get('/defaultnews', controllers.default_news)

// GET a particular Full NEWS
router.get('/homegetfullnews/:id', controllers.get_full_news)

// GET the about us page
router.get('/aboutus', controllers.aboutus)

// Get the history,guidelines,objectives,orientation program,examination, and library information
router.get('/history', controllers.history)

router.get('/objectives', controllers.objective)

router.get('/guidelines', controllers.guidelines)

router.get('/orientation', controllers.orientation)

router.get('/examination', controllers.exam)

router.get('/libraryinfo', controllers.libinfo)

// get the pages that renders the various courses
router.get('/100level', controllers.onelevel)

router.get('/200level', controllers.twolevel)

router.get('/300level', controllers.threelevel)

router.get('/400level', controllers.fourlevel)

// --------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// FOR STUDENTSSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Router GET for student signup form
router.get('/studentSignup', student_controllers.student_signup_get)

// Router POST for student signup
router.post('/studentSignup', student_controllers.student_signup_post)

// student login form
router.get('/login', student_controllers.get_login_form)

// POST student login form
router.post('/studenthome', student_controllers.test_login)

// GET Logged in student home
router.get('/studenthome', authMiddleware.loginRequired, student_controllers.get_student_home)

// Router to view a Student Profile.
router.get('/studentss/:id', student_controllers.loginRequired, student_controllers.profiler)

// GET student profile for update
router.get('/studentupdateprofile/:id', student_controllers.student_update_get)

// POST student profile for update
router.post('/studentupdateprofile/:id', student_controllers.student_update_post)

// POST for student update profile pics
router.post('/studentupdatepics/:id', student_controllers.student_update_pics)

// GET the list of students and their profiles
router.get('/studentlevelmates', student_controllers.loginRequired, student_controllers.list_psychology_students)

// GET the list of students and their profiles
router.get('/studentmates/:level', student_controllers.loginRequired, student_controllers.list_coursemates)

// Router GET for viewing a particular student profile
router.get('/studentstudentprofile/:id', student_controllers.loginRequired, student_controllers.view_coursemate_profile)

// Router for getting the list of all psychology staffs
router.get('/studentsstafflist', student_controllers.loginRequired, student_controllers.list_staffs)

// Router Get for viewing a particular profile
router.get('/studentstaffprofile/:id', student_controllers.loginRequired, student_controllers.view_staff_profile)

// Route for getting the NEWSPAGE-------------------------------------------------------------------------------
router.get('/studentgetlastnews', student_controllers.loginRequired, student_controllers.get_last_news)

// route for getting a particular NEWS
router.get('/studentgetfullnews/:id', student_controllers.loginRequired, student_controllers.get_full_news)

// Router for commenting on a particular NEWS
router.post('/studentcomments/:id', student_controllers.loginRequired, student_controllers.post_comment_news)

// Router for commenting on a reply in NEWS
router.post('/studentreplycomments/:id', student_controllers.loginRequired, student_controllers.news_reply_comment)

// Router for liking a particular NEWS
router.post('/newslike/:id', student_controllers.loginRequired, student_controllers.news_like)

// Router for disliking a particular NEWS
router.post('/newsdislike/:id', student_controllers.loginRequired, student_controllers.news_dislike)

// Router for liking a comment on a particular comment on a NEWS
router.post('/studentlikecomment/:id', student_controllers.loginRequired, student_controllers.post_like_comment)

// Router for disliking a particular comment on a NEWS
router.post('/studentdislikecomment/:id', student_controllers.loginRequired, student_controllers.post_dislike_comment)

// GET all Courses-----------------------------------------------------------------------------------------
router.get('/studentgetcourse/:level', student_controllers.loginRequired, student_controllers.get_courses)

// Router to GET a particular course details
router.get('/studentviewcourse/:id', student_controllers.loginRequired, student_controllers.view_courses)

// Router to register for a particular course
router.post('/studentregistercourse/:id', student_controllers.loginRequired, student_controllers.register_course)

// Router to delete a registered course
router.post('/deleteregisteredcourse/:id', student_controllers.loginRequired, student_controllers.delete_registered_course)

// Router to GET project topics
router.get('/studentgetprojecttopics', student_controllers.loginRequired, student_controllers.get_project_topics)

// Router to GET project topics
router.get('/studentgetproject/:topic', student_controllers.loginRequired, student_controllers.get_project_category)

// Router to Get a your Result
router.get('/myfullresults/:id', student_controllers.loginRequired, student_controllers.my_result)

// Router to GET Student timetable
router.get('/gettimetable', student_controllers.loginRequired, student_controllers.get_time_table)

// Router GET for course rep to edit time table
router.get('/studentedittimetable/:id', student_controllers.loginRequired, student_controllers.edit_timetable)

// Router for POST course rep to post edited time table
router.post('/studentedittimetable/:id', student_controllers.loginRequired, student_controllers.edit_post_timetable)

// Routes for handling everything messages---------------------------------------------------------------------
// Router for student to read messages
router.get('/getconverse/:id', student_controllers.loginRequired, student_controllers.get_converse)

// Router for student to read messages
router.get('/getmessages/:recipient', student_controllers.loginRequired, student_controllers.get_messages)

// Router for student to logout
router.post('/newconversation/:recipient', student_controllers.loginRequired, student_controllers.new_conversation)

// Router for student to logout
router.get('/logout', student_controllers.loginRequired, student_controllers.logout)

module.exports = router
