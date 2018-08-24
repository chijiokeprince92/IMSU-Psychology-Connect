var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var uploaded = require('../upload');
var newsproject = require('../news_project');
var projectvalid = require('../project_valid');

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

// Get the history,guidelines,objectives,orientation program,examination, and library information

router.get('/history', controllers.history);

router.get('/objectives', controllers.objective);

router.get('/guidelines', controllers.guidelines);

router.get('/orientation', controllers.orientation);

router.get('/examination', controllers.exam);

router.get('/libraryinfo', controllers.libinfo);
// get library page
router.get('/library', controllers.library);

// -----------------------------------------------------------------
// get the pages that renders the various courses
router.get('/100level', controllers.onelevel);

router.get('/200level', controllers.twolevel);

router.get('/300level', controllers.threelevel);

router.get('/400level', controllers.fourlevel);


// get NAPS informations and current event
router.get('/news', controllers.news);

//-------------------------------------------------------------------
// this is the column that deals with the library components

router.get('/e-library', controllers.elibrary);

router.get('/projectTopics', controllers.project);


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

router.get('/studenthome', student_controllers.get_student_home);

router.get('/getelibrary', student_controllers.get_elibrary);

router.get('/getprojecttopics', student_controllers.get_project_topics);

// GET the list of students and their profiles
router.get('/studentstudentlist', student_controllers.list_coursemates);

router.get('/studentstudentprofile/:id', student_controllers.view_coursemate_profile);

router.get('/logout', student_controllers.logout);


// GET Student Profile.
router.get('/studentss/:id', student_controllers.profiler);

//Get a single Student Result
router.get('/studentresult', student_controllers.student_result);

router.get('/gettimetable', student_controllers.get_time_table);

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

router.get('/staffhome', staff_controllers.staff_home);

//staff signup form
router.get('/staffSignup', staff_controllers.staff_signup_get);

router.post('/staffSignup', uploaded, staff_controllers.staff_signup_post);


// staff login form
router.get('/stafflogin', staff_controllers.staff_login_get);

router.post('/stafflogin', staff_controllers.staff_login_post);

// Log Staff Out
router.get('/stafflogout', staff_controllers.staff_logout);

// GET Staff Profile.
router.get('/staffss/:id', staff_controllers.staff_profiler);

//--------------------------------------------------------------------------------------------------
// GET the list of students and their profiles
router.get('/staffstudentlist', staff_controllers.list_students);

router.get('/staffstudentprofile/:id', staff_controllers.view_student_profile);

router.get('/stafflist100students', staff_controllers.list_100_student);

router.get('/stafflist200students', staff_controllers.list_200_student);

router.get('/stafflist300students', staff_controllers.list_300_student);

router.get('/stafflist400students', staff_controllers.list_400_student);

router.get('/staffsstafflist', staff_controllers.list_staffs);

router.get('/staffstaffprofile/:id', staff_controllers.view_staff_profile);

router.get('/staffgetlastnews', staff_controllers.get_last_news);

router.get('/saffuploadproject', staff_controllers.upload_projects);

router.get('/staffgetprojecttopics', staff_controllers.staff_get_project_topics);




// Get the history,guidelines,objectives,orientation program,examination, and library information

// get NAPS informations and current event
router.get('/staffnews', staff_controllers.staff_news);

router.get('/staffhistory', staff_controllers.staff_history);

router.get('/staffobjectives', staff_controllers.staff_objectives);

router.get('/staffguidelines', staff_controllers.staff_guidelines);

router.get('/stafforientation', staff_controllers.staff_orientation);

router.get('/staffexamination', staff_controllers.staff_exam);

router.get('/stafflibinfo', staff_controllers.staff_libinfo);


// get library page
router.get('/stafflibrary', staff_controllers.staff_library);

//-------------------------------------------------------------------
// this is the column that deals with the library components

router.get('/staffelibrary', staff_controllers.staff_elibrary);

router.get('/staffprojecttopics', staff_controllers.staff_project);

// -----------------------------------------------------------------
// get the pages that renders the various courses
router.get('/staff100level', staff_controllers.staff_onelevel);

router.get('/staff200level', staff_controllers.staff_twolevel);

router.get('/staff300level', staff_controllers.staff_threelevel);

router.get('/staff400level', staff_controllers.staff_fourlevel);


//-------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
// FOR ADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.get('/x2f4hjks8xmn', admin_controllers.admin_signup_get);

router.post('/x2f4hjks8xmn', admin_controllers.admin_signup_post);

router.get('/adminlogin', admin_controllers.admin_login_get);

router.post('/adminlogin', admin_controllers.admin_login_post);

router.get('/hercules/admin', admin_controllers.admin_session_force, admin_controllers.admin);

router.get('/adminss/:id', admin_controllers.admin_session_force, admin_controllers.profiler);

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

router.post('/getprojectform', admin_controllers.admin_session_force, admin_controllers.post_upload_project);

router.get('/getprojecttopics', admin_controllers.admin_session_force, projectvalid, admin_controllers.get_project_topics);

// GET and POST routes for handling NEWS 
router.get('/getnewsform', admin_controllers.admin_session_force, admin_controllers.get_upload_news);

router.post('/getnewsform', admin_controllers.admin_session_force, newsproject, admin_controllers.post_upload_news);

router.get('/getlastnews', admin_controllers.admin_session_force, admin_controllers.get_last_news);


// GET the various chat group and send a message

router.get('/send100', admin_controllers.admin_session_force, admin_controllers.send_100);

router.get('/send200', admin_controllers.admin_session_force, admin_controllers.send_200);

router.get('/send300', admin_controllers.admin_session_force, admin_controllers.send_300);

router.get('/send400', admin_controllers.admin_session_force, admin_controllers.send_400);

module.exports = router;