var express = require('express');
var router = express.Router();

var controllers = require('../controllers/view_controller');
var student_controllers = require('../controllers/student_controllers');
var staff_controllers = require('../controllers/staff_controllers');
var admin_controllers = require('../controllers/admin_controllers');


//---------------------------------------------------------------------
// FOR STUDENTSSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/* GET home page. */
router.get('/', controllers.home);

// Chat Request
router.get('/chat', student_controllers.loginRequired, student_controllers.chat);


//---------------------------------------------------------------------------
// student signup form
router.get('/studentSignup', student_controllers.student_signup_get);

router.post('/studentSignup', student_controllers.student_signup_post);


// student login form
router.get('/login', student_controllers.get_login_form);

router.post('/login', student_controllers.test_login);

router.get('/logout', student_controllers.logout);


// GET Student Profile.
router.get('/studentss/:id', student_controllers.profiler);

//Get a single Student Result
router.get('/studentresult', student_controllers.student_result);

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
router.get('/buyBooks', controllers.bookshop);

router.get('/e-library', controllers.elibrary);

router.get('/projectTopics', controllers.project);

router.get('/addArticle', controllers.article);








//------------------------------------------------------------------------
// FOR STAFFSSS!!!!!!!!!!!!!!!!!!

router.get('/staffhome', staff_controllers.staff_home);

//staff signup form
router.get('/staffSignup', staff_controllers.staff_signup_get);

router.post('/staffSignup', staff_controllers.staff_signup_post);


// staff login form
router.get('/stafflogin', staff_controllers.staff_login_get);

router.post('/stafflogin', staff_controllers.staff_login_post);

// Log Staff Out
router.get('/stafflogout', staff_controllers.staff_logout);

// GET Staff Profile.
router.get('/staffss/:id', staff_controllers.staff_profiler);

//--------------------------------------------------------------------------------------------------

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






//------------------------------------------------------------------------------
// FOR ADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.get('/hercules/gladiators/spartans/admin', admin_controllers.admin);

// GET the number of registered students
router.get('/number', admin_controllers.index);

//GET the List of All the Students in Psychology
router.get('/studentlist', admin_controllers.list_students)

// GET the number of registered staffs
router.get('/staffnumber', admin_controllers.staff_index);

router.get('/stafflist', admin_controllers.list_staffs);



// GET the various chat group and send a message

router.get('/send100', admin_controllers.send_100);

router.get('/send200', admin_controllers.send_200);

router.get('/send300', admin_controllers.send_300);

router.get('/send400', admin_controllers.send_400);

module.exports = router;