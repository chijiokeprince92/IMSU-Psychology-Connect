var express = require('express');
var router = express.Router();

var controllers = require('../controllers/loginController');
var signup_controllers = require('../controllers/signupController');

/* GET home page. */
router.get('/', controllers.home);


// student signup form
router.get('/student_signup', signup_controllers.student);

router.post('/student_signup', signup_controllers.student);


//staff signup form
router.get('/staff_signup', signup_controllers.staff);

router.post('/staff_signup', signup_controllers.student);


//both student and staff login form
router.get('/login', controllers.login)

    .post('/login', controllers.loginPost);


// Get the history,guidelines,objectives,orientation program,examination, and library information
router.get('/new', controllers.new);

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