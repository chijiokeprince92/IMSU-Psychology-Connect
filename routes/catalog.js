var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var uploaded = require('../upload');
var newsproject = require('../news_project');
var projectmulter = require('../project_multer');

var controllers = require('../controllers/view_controller');
var student_controllers = require('../controllers/student_controllers');
var staff_controllers = require('../controllers/staff_controllers');
var admin_controllers = require('../controllers/admin_controllers');


//--------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
// FOR HOMEPAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


/* GET home page. */
router.get('/', controllers.home);

router.get('/defaultnews', controllers.default_news);

router.get('/aboutus', controllers.aboutus);

// Get the history,guidelines,objectives,orientation program,examination, and library information
router.get('/history', controllers.history);

router.get('/objectives', controllers.objective);

router.get('/guidelines', controllers.guidelines);

router.get('/orientation', controllers.orientation);

router.get('/examination', controllers.exam);

router.get('/libraryinfo', controllers.libinfo);
// -----------------------------------------------------------------
// get the pages that renders the various courses
router.get('/100level', controllers.onelevel);

router.get('/200level', controllers.twolevel);

router.get('/300level', controllers.threelevel);

router.get('/400level', controllers.fourlevel);

//--------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
// FOR STUDENTSSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// student signup form
router.get('/studentSignup', student_controllers.student_signup_get);

router.post('/studentSignup', uploaded, student_controllers.student_signup_post);


// student login form
router.get('/login', student_controllers.get_login_form);

router.post('/login', student_controllers.test_login);

router.get('/studenthome', student_controllers.loginRequired, student_controllers.get_student_home);

//GET student profile for update
router.get('/studentupdateprofile/:id', student_controllers.student_update_get);

//POST student profile for update
router.post('/studentupdateprofile/:id', uploaded, student_controllers.student_update_post);

router.get('/studentgetlastnews', student_controllers.loginRequired, student_controllers.get_last_news);



// GET the list of students and their profiles
router.get('/studentstudentlist', student_controllers.loginRequired, student_controllers.list_coursemates);

router.get('/studentstudentprofile/:id', student_controllers.loginRequired, student_controllers.view_coursemate_profile);

router.get('/studentstaffprofile/:id', student_controllers.loginRequired, student_controllers.view_staff_profile);

router.get('/studentsstafflist', student_controllers.loginRequired, student_controllers.list_staffs);

router.get('/getprojecttopics', student_controllers.loginRequired, student_controllers.get_project_topics);


// GET all Courses
router.get('/studentgetallcourses', student_controllers.loginRequired, student_controllers.get_100_courses);

//GET 200 Level courses
router.get('/studentget200courses', student_controllers.loginRequired, student_controllers.get_200_courses);

//GET 300 Level courses
router.get('/studentget300courses', student_controllers.loginRequired, student_controllers.get_300_courses);

//GET 400 Level courses
router.get('/studentget400courses', student_controllers.loginRequired, student_controllers.get_400_courses);


//GET a particular course details
router.get('/studentviewcourse/:id', student_controllers.loginRequired, student_controllers.view_courses);

// GET student project topics
router.get('/studentgetprojecttopics', student_controllers.loginRequired, student_controllers.get_project_topic);

router.get('/logout', student_controllers.loginRequired, student_controllers.logout);


// GET Student Profile.
router.get('/studentss/:id', student_controllers.loginRequired, student_controllers.profiler);

//Get a single Student Result
router.get('/studentresult', student_controllers.loginRequired, student_controllers.student_result);

router.get('/gettimetable', student_controllers.loginRequired, student_controllers.get_time_table);

// Chat Request
router.get('/chat', student_controllers.loginRequired, student_controllers.chat);


//-----------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
// FOR STAFFSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//staff signup form
router.get('/staffSignup', staff_controllers.staff_signup_get);

router.post('/staffSignup', uploaded, staff_controllers.staff_signup_post);


// staff login form
router.get('/stafflogin', staff_controllers.staff_login_get);

router.post('/stafflogin', staff_controllers.staff_login_post);

router.get('/staffhome', staff_controllers.staffloginRequired, staff_controllers.staff_home);

// GET Staff Profile.
router.get('/staffss/:id', staff_controllers.staffloginRequired, staff_controllers.staff_profiler);

//GET staff profile for update
router.get('/staffupdateprofile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_update_get);

//GET staff profile for update
router.post('/staffupdateprofile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_update_post);

// Log Staff Out
router.get('/stafflogout', staff_controllers.staffloginRequired, staff_controllers.staff_logout);


//--------------------------------------------------------------------------------------------------
// GET the list of students and their profiles
router.get('/staffstudentlist', staff_controllers.staffloginRequired, staff_controllers.list_students);

router.get('/staffstudentprofile/:id', staff_controllers.staffloginRequired, staff_controllers.view_student_profile);

router.get('/stafflist100students', staff_controllers.staffloginRequired, staff_controllers.list_100_student);

router.get('/stafflist200students', staff_controllers.staffloginRequired, staff_controllers.list_200_student);

router.get('/stafflist300students', staff_controllers.staffloginRequired, staff_controllers.list_300_student);

router.get('/stafflist400students', staff_controllers.staffloginRequired, staff_controllers.list_400_student);

router.get('/staffsstafflist', staff_controllers.staffloginRequired, staff_controllers.list_staffs);

router.get('/staffstaffprofile/:id', staff_controllers.staffloginRequired, staff_controllers.view_staff_profile);

router.get('/staffgetlastnews', staff_controllers.staffloginRequired, staff_controllers.get_last_news);

router.get('/saffuploadproject', staff_controllers.staffloginRequired, staff_controllers.upload_projects);

router.get('/staffgetprojecttopics', staff_controllers.staffloginRequired, staff_controllers.get_project_topics);

// GET all Courses
router.get('/staffgetallcourses', staff_controllers.staffloginRequired, staff_controllers.get_100_courses);

//GET 200 Level courses
router.get('/staffget200courses', staff_controllers.staffloginRequired, staff_controllers.get_200_courses);

//GET 300 Level courses
router.get('/staffget300courses', staff_controllers.staffloginRequired, staff_controllers.get_300_courses);

//GET 400 Level courses
router.get('/staffget400courses', staff_controllers.staffloginRequired, staff_controllers.get_400_courses);


//GET a particular course details
router.get('/staffviewcourse/:id', staff_controllers.staffloginRequired, staff_controllers.view_courses);


//-------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
// FOR ADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.get('/x2f4hjks8xmn', admin_controllers.admin_signup_get);

router.post('/x2f4hjks8xmn', admin_controllers.admin_signup_post);

router.get('/adminlogin', admin_controllers.admin_login_get);

router.post('/hercules/admin', admin_controllers.admin_login_post);

router.get('/hercules/admin', admin_controllers.admin_session_force, admin_controllers.admin);

router.get('/adminss/:id', admin_controllers.admin_session_force, admin_controllers.profiler);
//GET admin profile for update
router.get('/updateprofile/:id', admin_controllers.admin_session_force, admin_controllers.admin_update_get);

//POST admin profile for update
router.post('/updateprofile/:id', admin_controllers.admin_session_force, admin_controllers.admin_update_post);

router.get('/adminlogout', admin_controllers.admin_logout);



//GET the List of All the Students in Psychology
router.get('/studentlist', admin_controllers.admin_session_force, admin_controllers.list_students);

router.get('/studentprofile/:id', admin_controllers.view_student_profile);



router.get('/list100students', admin_controllers.admin_session_force, admin_controllers.list_100_student);

router.get('/list200students', admin_controllers.admin_session_force, admin_controllers.list_200_student);

router.get('/list300students', admin_controllers.admin_session_force, admin_controllers.list_300_student);

router.get('/list400students', admin_controllers.admin_session_force, admin_controllers.list_400_student);

// GET the number of registered staffs

router.get('/stafflist', admin_controllers.admin_session_force, admin_controllers.list_staffs);

router.get('/staffprofile/:id', admin_controllers.admin_session_force, admin_controllers.view_staff_profile);

router.get('/student/results', admin_controllers.admin_session_force, admin_controllers.student_results);

//GET and POST routes for handling PROJECT Topics
router.get('/getprojectform', admin_controllers.admin_session_force, admin_controllers.get_upload_project);

router.post('/getprojectform', admin_controllers.admin_session_force, projectmulter, admin_controllers.post_upload_project);

router.get('/getprojecttopicss', admin_controllers.admin_session_force, admin_controllers.get_project_topics);

// GET and POST routes for handling NEWS 
router.get('/getnewsform', admin_controllers.admin_session_force, admin_controllers.get_upload_news);

router.post('/getnewsform', admin_controllers.admin_session_force, newsproject, admin_controllers.post_upload_news);

router.get('/getlastnews', admin_controllers.admin_session_force, admin_controllers.get_last_news);

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
router.get('/adminviewcourse/:id', admin_controllers.admin_session_force, admin_controllers.view_course);

//GET a particular course details
router.get('/addcourseoutline/:id', admin_controllers.admin_session_force, admin_controllers.course_update_get);


// POST UPDATE a course outline
router.post('/addcourseoutline/:id', admin_controllers.admin_session_force, admin_controllers.course_update_post);


// GET the various chat group and send a message

router.get('/send100', admin_controllers.admin_session_force, admin_controllers.send_100);

router.get('/send200', admin_controllers.admin_session_force, admin_controllers.send_200);

router.get('/send300', admin_controllers.admin_session_force, admin_controllers.send_300);

router.get('/send400', admin_controllers.admin_session_force, admin_controllers.send_400);

module.exports = router;