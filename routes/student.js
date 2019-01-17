var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var uploaded = require('../upload');
var newsproject = require('../news_project');
var projectmulter = require('../project_multer');

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')

var testing_controllers = require('../controllers/testing');
var controllers = require('../controllers/view_controller');
var student_controllers = require('../controllers/student_controllers');



//--------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
// FOR HOMEPAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/testinggetlastnews', testing_controllers.get_last_news);

router.get('/testinggetfullnews/:id', testing_controllers.get_full_news);

router.get('/angularhome', testing_controllers.angular);

router.get('/newscount', testing_controllers.get_count_news);

router.get('/angularjs', controllers.angular);

router.get('/ajaxjs', controllers.ajax);
//----------------------------------------------------------------------------------

/* GET home page. */
router.get('/', controllers.home);

//GET the homepage NEWSPAGE
router.get('/defaultnews', controllers.default_news);

//GET a particular Full NEWS
router.get('/homegetfullnews/:id', controllers.get_full_news);

//GET the about us page
router.get('/aboutus', controllers.aboutus);

// Get the history,guidelines,objectives,orientation program,examination, and library information
router.get('/history', controllers.history);

router.get('/objectives', controllers.objective);

router.get('/guidelines', controllers.guidelines);

router.get('/orientation', controllers.orientation);

router.get('/examination', controllers.exam);

router.get('/libraryinfo', controllers.libinfo);

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

//Router GET for student signup form
router.get('/studentSignup', student_controllers.student_signup_get);

//Router POST for student signup
router.post('/studentSignup', uploaded, student_controllers.student_signup_post);

// student login form
router.get('/login', student_controllers.get_login_form);

//POST student login form
router.post('/studenthome', student_controllers.test_login);

//GET Logged in student home
router.get('/studenthome', authMiddleware.loginRequired, student_controllers.get_student_home);

//Router to view a Student Profile.
router.get('/studentss/:id', student_controllers.loginRequired, student_controllers.profiler);


//GET student profile for update
router.get('/studentupdateprofile/:id', student_controllers.student_update_get);

//POST student profile for update
router.post('/studentupdateprofile/:id', uploaded, student_controllers.student_update_post);

//POST for student update profile pics
router.post('/studentupdatepics/:id', uploaded, student_controllers.student_update_pics);

// GET the list of course mates and their profiles
router.get('/studentstudentlist', student_controllers.loginRequired, student_controllers.list_coursemates);

// GET the list of students and their profiles
router.get('/studentlevelmates', student_controllers.loginRequired, student_controllers.list_psychology_students);

// GET the list of 100 students and their profiles
router.get('/student100mates', student_controllers.loginRequired, student_controllers.list_100mates);

// GET the list of 200 students and their profiles
router.get('/student200mates', student_controllers.loginRequired, student_controllers.list_200mates);

// GET the list of 300 students and their profiles
router.get('/student300mates', student_controllers.loginRequired, student_controllers.list_300mates);

// GET the list of 400 students and their profiles
router.get('/student400mates', student_controllers.loginRequired, student_controllers.list_400mates);

//Router GET for viewing a particular student profile
router.get('/studentstudentprofile/:id', student_controllers.loginRequired, student_controllers.view_coursemate_profile);

//Router for getting the list of all psychology staffs
router.get('/studentsstafflist', student_controllers.loginRequired, student_controllers.list_staffs);

//Router Get for viewing a particular profile
router.get('/studentstaffprofile/:id', student_controllers.loginRequired, student_controllers.view_staff_profile);

//Route for getting the NEWSPAGE
router.get('/studentgetlastnews', student_controllers.loginRequired, student_controllers.get_last_news);

//route for getting a particular NEWS
router.get('/studentgetfullnews/:id', student_controllers.loginRequired, student_controllers.get_full_news);

//Router for commenting on a particular NEWS
router.post('/studentcomments/:id', student_controllers.loginRequired, student_controllers.post_comment_news);

//Router for commenting on a reply in NEWS
router.post('/studentreplycomments/:id', student_controllers.loginRequired, student_controllers.post_reply_comment);

//Router for liking a particular NEWS
router.post('/studentnewslike/:id', student_controllers.loginRequired, student_controllers.post_news_like);

//Router for disliking a particular NEWS
router.post('/studentnewsdislike/:id', student_controllers.loginRequired, student_controllers.post_news_dislike);

//Router for liking a comment on a particular comment on a NEWS
router.post('/studentlikecomment/:id', student_controllers.loginRequired, student_controllers.post_like_comment);

//Router for disliking a particular comment on a NEWS
router.post('/studentdislikecomment/:id', student_controllers.loginRequired, student_controllers.post_dislike_comment);

// GET all Courses
router.get('/studentgetallcourses', student_controllers.loginRequired, student_controllers.get_100_courses);

//GET 200 Level courses
router.get('/studentget200courses', student_controllers.loginRequired, student_controllers.get_200_courses);

//GET 300 Level courses
router.get('/studentget300courses', student_controllers.loginRequired, student_controllers.get_300_courses);

//GET 400 Level courses
router.get('/studentget400courses', student_controllers.loginRequired, student_controllers.get_400_courses);

//Router to GET a particular course details
router.get('/studentviewcourse/:id', student_controllers.loginRequired, student_controllers.view_courses);

//GET a particular course details
router.get('/studentviewcourselect/:id', student_controllers.loginRequired, student_controllers.student_course_registered);

//Router to register for a particular course
router.post('/studentregistercourse/:id', student_controllers.loginRequired, student_controllers.register_course);

//Router to delete a registered course
router.post('/deleteregisteredcourse/:id', student_controllers.loginRequired, student_controllers.delete_registered_course);

// Router to GET project topics
router.get('/studentgetprojecttopics', student_controllers.loginRequired, student_controllers.get_project_topics);

//Router to Get a your Result
router.get('/myfullresults/:id', student_controllers.loginRequired, student_controllers.student_result);

//Router to GET Student timetable
router.get('/gettimetable', student_controllers.loginRequired, student_controllers.get_time_table);

//Router for course rep to add time table
router.get('/studentaddtimetable/:id', student_controllers.loginRequired, student_controllers.add_time_table);

//Router for course rep to post new timetable
router.post('/studentaddtimetable/:id', student_controllers.loginRequired, student_controllers.post_time_table);

//Router GET for course rep to edit time table
router.get('/studentedittimetable/:id', student_controllers.loginRequired, student_controllers.edit_timetable);

//Router for POST course rep to post edited time table
router.post('/studentedittimetable/:id', student_controllers.loginRequired, student_controllers.edit_post_timetable);

//Router for student to logout 
router.get('/logout', student_controllers.loginRequired, student_controllers.logout);

// Chat Request
router.get('/chat', student_controllers.loginRequired, student_controllers.chat);


module.exports = router;