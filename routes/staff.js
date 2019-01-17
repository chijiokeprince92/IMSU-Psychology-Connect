var express = require('express');
var router = express.Router();
var path = require('path');
var uploaded = require('../upload');

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')

var staff_controllers = require('../controllers/staff_controllers');


// FOR STAFFSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// staff login form
router.get('/login', staff_controllers.staff_login_get);

router.post('/staffhome', staff_controllers.staff_login_post);

router.get('/staffhome', staff_controllers.staffloginRequired, staff_controllers.staff_home);

// GET Staff Profile.
router.get('/profile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_profiler);

//GET staff profile for update
router.get('/updateprofile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_update_get);

//GET staff profile for update
router.post('/updateprofile/:id', staff_controllers.staffloginRequired, staff_controllers.staff_update_post);

router.post('/updatepics/:id', uploaded, staff_controllers.staff_update_pics);

// GET the list of students and their profiles
router.get('/studentlist', staff_controllers.staffloginRequired, staff_controllers.list_students);

//GET a single student profile
router.get('/studentprofile/:id', staff_controllers.staffloginRequired, staff_controllers.view_student_profile);

//GET all 100 level students
router.get('/list100students', staff_controllers.staffloginRequired, staff_controllers.list_100_student);

//GET all 200 level students
router.get('/list200students', staff_controllers.staffloginRequired, staff_controllers.list_200_student);

//GET all 300 level students
router.get('/list300students', staff_controllers.staffloginRequired, staff_controllers.list_300_student);

//GET all 400 level students
router.get('/list400students', staff_controllers.staffloginRequired, staff_controllers.list_400_student);

//Get a single Student Result
router.get('/studentfullresults/:id', staff_controllers.staffloginRequired, staff_controllers.student_result);

//---------------------------------------------------------------------------------------------------------------

//GET all psychology staffs
router.get('/stafflist', staff_controllers.staffloginRequired, staff_controllers.list_staffs);

//GET staff colleague profile
router.get('/colleague/:id', staff_controllers.staffloginRequired, staff_controllers.view_staff_profile);

//GET staff time table
router.get('/getschedule', staff_controllers.staffloginRequired, staff_controllers.get_schedule);

// GET 100 Courses
router.get('/get100courses', staff_controllers.staffloginRequired, staff_controllers.get_100_courses);

//GET 200 Level courses
router.get('/get200courses', staff_controllers.staffloginRequired, staff_controllers.get_200_courses);

//GET 300 Level courses
router.get('/get300courses', staff_controllers.staffloginRequired, staff_controllers.get_300_courses);

//GET 400 Level courses
router.get('/get400courses', staff_controllers.staffloginRequired, staff_controllers.get_400_courses);

//UPDATE a course outline
router.post('/editcourseoutline/:id', staff_controllers.staffloginRequired, staff_controllers.edit_courseoutline);

//GET a particular course details
router.get('/viewcourse/:id', staff_controllers.staffloginRequired, staff_controllers.view_courses);

//GET a particular course details
router.get('/viewcourselect/:id', staff_controllers.staffloginRequired, staff_controllers.student_course_registered);

//GET the latest news
router.get('/getlastnews', staff_controllers.staffloginRequired, staff_controllers.get_last_news);

//GET a particular news
router.get('/getfullnews/:id', staff_controllers.staffloginRequired, staff_controllers.get_full_news);

//POST a comment on a news
router.post('/staffcomments/:id', staff_controllers.staffloginRequired, staff_controllers.post_comment_news);

//GET project topics
router.get('/getprojecttopics', staff_controllers.staffloginRequired, staff_controllers.get_project_topics);

//POST a project topic
router.get('/saffuploadproject', staff_controllers.staffloginRequired, staff_controllers.upload_projects);

// Staff Logout
router.get('/logout', staff_controllers.staffloginRequired, staff_controllers.staff_logout);


module.exports = router;