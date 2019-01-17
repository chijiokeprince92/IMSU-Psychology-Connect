var express = require('express');
var router = express.Router();
var path = require('path');
var uploaded = require('../upload');
var newsproject = require('../news_project');
var projectmulter = require('../project_multer');

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware');

var admin_controllers = require('../controllers/admin_controllers');

//-------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
// FOR ADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.get('/x2f4hjks8xmn', admin_controllers.admin_signup_get);

router.post('/x2f4hjks8xmn', admin_controllers.admin_signup_post);

router.get('/login', admin_controllers.admin_login_get);

router.post('/hercules', admin_controllers.admin_login_post);

router.get('/hercules', admin_controllers.admin_session_force, admin_controllers.admin);

router.get('/profile/:id', admin_controllers.admin_session_force, admin_controllers.profiler);
//GET admin profile for update
router.get('/updateprofile/:id', admin_controllers.admin_session_force, admin_controllers.admin_update_get);

//POST admin profile for update
router.post('/updateprofile/:id', admin_controllers.admin_session_force, admin_controllers.admin_update_post);

router.get('/logout', admin_controllers.admin_logout);



//GET the List of All the Students in Psychology
router.get('/studentlist', admin_controllers.admin_session_force, admin_controllers.list_students);

router.get('/studentprofile/:id', admin_controllers.view_student_profile);

router.post('/makecourserep/:id', admin_controllers.admin_session_force, admin_controllers.student_make_courserep);

router.post('/deletestudent/:id', admin_controllers.admin_session_force, admin_controllers.delete_student);


router.get('/list100students', admin_controllers.admin_session_force, admin_controllers.list_100_student);

router.get('/list200students', admin_controllers.admin_session_force, admin_controllers.list_200_student);

router.get('/list300students', admin_controllers.admin_session_force, admin_controllers.list_300_student);

router.get('/list400students', admin_controllers.admin_session_force, admin_controllers.list_400_student);

// GET the number of registered staffs

router.get('/stafflist', admin_controllers.admin_session_force, admin_controllers.list_staffs);

router.get('/staffprofile/:id', admin_controllers.admin_session_force, admin_controllers.view_staff_profile);

router.post('/deletestaff/:id', admin_controllers.admin_session_force, admin_controllers.delete_staff);

router.get('/studentfillresult', admin_controllers.admin_session_force, admin_controllers.student_fillresult);

router.post('/studentfillresult', admin_controllers.admin_session_force, admin_controllers.student_fillresult_post);

router.get('/studentaddresult/:id', admin_controllers.admin_session_force, admin_controllers.student_addresult_get);

router.post('/studentaddresult/:id', admin_controllers.admin_session_force, admin_controllers.student_addresults_post);

//Get a single Student Result
router.get('/studentfullresults/:id', admin_controllers.admin_session_force, admin_controllers.student_result);

//Get all the Results
router.get('/viewallresults', admin_controllers.admin_session_force, admin_controllers.view_all_results);

//Delete a particular Results
router.post('/deleteresult/:id', admin_controllers.admin_session_force, admin_controllers.delete_result);

//GET and POST routes for handling PROJECT Topics
router.get('/getprojectform', admin_controllers.admin_session_force, admin_controllers.get_upload_project);

router.post('/getprojectform', admin_controllers.admin_session_force, projectmulter, admin_controllers.post_upload_project);

router.get('/getprojecttopicss', admin_controllers.admin_session_force, admin_controllers.get_project_topics);

router.post('/deleteproject/:id', admin_controllers.admin_session_force, admin_controllers.delete_project);


router.get('/gettimetables', admin_controllers.admin_session_force, admin_controllers.get_time_table);


// GET and POST routes for handling NEWS 
router.get('/getnewsform', admin_controllers.admin_session_force, admin_controllers.get_upload_news);

router.post('/getnewsform', admin_controllers.admin_session_force, newsproject, admin_controllers.post_upload_news);

router.get('/getlastnews', admin_controllers.admin_session_force, admin_controllers.get_last_news);

router.get('/getfullnews/:id', admin_controllers.admin_session_force, admin_controllers.get_full_news);

router.post('/comments/:id', admin_controllers.admin_session_force, admin_controllers.post_comment_news);

router.get('/editnews/:id', admin_controllers.admin_session_force, admin_controllers.news_edit_get);

router.post('/editnews/:id', admin_controllers.admin_session_force, admin_controllers.news_edit_post);

router.post('/deletenews/:id', admin_controllers.admin_session_force, admin_controllers.delete_news);

// GET Courses and Courses Form
router.get('/getcourseform', admin_controllers.admin_session_force, admin_controllers.add_courses);

router.post('/getcourseform', admin_controllers.admin_session_force, admin_controllers.post_course);

// GET all Courses
router.get('/getallcourses', admin_controllers.admin_session_force, admin_controllers.get_100_courses);

//GET 200 Level courses
router.get('/get200courses', admin_controllers.admin_session_force, admin_controllers.get_200_courses);

//GET 300 Level courses
router.get('/get300courses', admin_controllers.admin_session_force, admin_controllers.get_300_courses);

//GET 400 Level courses
router.get('/get400courses', admin_controllers.admin_session_force, admin_controllers.get_400_courses);


//GET a particular course details
router.get('/viewcourse/:id', admin_controllers.admin_session_force, admin_controllers.view_course);

//GET a particular course details
router.get('/viewcourselect/:id', admin_controllers.admin_session_force, admin_controllers.student_coursesoffered);

//GET a particular course details
router.get('/addcourseoutline/:id', admin_controllers.admin_session_force, admin_controllers.course_update_get);

// POST UPDATE a course outline
router.post('/addcourseoutline/:id', admin_controllers.admin_session_force, admin_controllers.course_update_post);

router.post('/editcourselecturer/:id', admin_controllers.admin_session_force, admin_controllers.edit_course_lecturer);

router.post('/deletecourselecturer/:id', admin_controllers.admin_session_force, admin_controllers.delete_course_lecturer);

router.post('/deletecourse/:id', admin_controllers.admin_session_force, admin_controllers.delete_course);

//staff signup form
router.get('/staffSignup', admin_controllers.admin_session_force, admin_controllers.staff_signup_get);

router.post('/staffSignup', admin_controllers.admin_session_force, admin_controllers.staff_signup_post);


module.exports = router;