var express = require('express');
var router = express.Router();

var controllers = require('../controllers/viewController');
var signup_controllers = require('../controllers/signupController');

/* GET home page. */
router.get('/', controllers.home);

router.get('/chat', signup_controllers.chat);
// student signup form
router.get('/studentSignup', signup_controllers.student_signup_get);

router.post('/studentSignup', signup_controllers.student_signup_post);


// student login form
router.get('/login', signup_controllers.get_login_form);

router.post('/login', signup_controllers.test_login);


//staff signup form
router.get('/staffSignup', signup_controllers.staff_signup_get);

router.post('/staffSignup', signup_controllers.staff_signup_post);

// GET request for displayinga single Student.
router.get('/studentss/:id', signup_controllers.profiler);


router.get('/number', signup_controllers.index);




// Get the history,guidelines,objectives,orientation program,examination, and library information

router.get('/history', controllers.history);

router.get('/objectives', controllers.objective);

router.get('/guidelines', controllers.guidelines);

router.get('/orientation', controllers.orientation);

router.get('/examination', controllers.exam);

router.get('/libraryinfo', controllers.libinfo);


// get library page
router.get('/library', controllers.library);


// get he pages that renders the various courses
router.get('/100level', controllers.onelevel);

router.get('/200level', controllers.twolevel);

router.get('/300level', controllers.threelevel);

router.get('/400level', controllers.fourlevel);


// get NAPS informations and current event
router.get('/news', controllers.news);


// this is the column that deals with the library components
router.get('/buyBooks', controllers.bookshop);

router.get('/e-library', controllers.elibrary);

router.get('/projectTopics', controllers.project);

router.get('/addArticle', controllers.article);

module.exports = router;