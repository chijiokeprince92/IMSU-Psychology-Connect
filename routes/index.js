var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('pages/home', {
    title: 'Home Page'
  });
});

router.get('/aboutus', function (req, res, next) {
  res.render('pages/AboutUs', {
    title: 'about NAPS'
  });
});

router.get('/history', function (req, res, next) {
  res.render('pages/history', {
    title: 'History of NAPS'
  });
});

router.get('/objectives', function (req, res, next) {
  res.render('pages/objectives', {
    title: 'Objectives of NAPS'
  });
});

router.get('/guidelines', function (req, res, next) {
  res.render('pages/guidelines', {
    title: 'Guidelines of NAPS'
  });
});

router.get('/orientation', function (req, res, next) {
  res.render('pages/orientation', {
    title: 'Orientation'
  });
});

router.get('/examination', function (req, res, next) {
  res.render('pages/examination', {
    title: 'Examination Rules and Regulations'
  });
});

router.get('/libraryinfo', function (req, res, next) {
  res.render('pages/libraryInfo', {
    title: 'Library Informations'
  });
});

router.get('/library', function (req, res, next) {
  res.render('pages/Library', {
    title: 'library'
  });
});

router.get('/student_signup', function (req, res, next) {
  res.render('pages/student_signup', {
    title: 'student_signup'
  });
});

router.get('/staff_signup', function (req, res, next) {
  res.render('pages/staff_signup', {
    title: 'staff_signUp'
  });
});

router.get('/100level', function (req, res, next) {
  res.render('pages/100levelcourse', {
    title: '100level'
  });
});

router.get('/200level', function (req, res, next) {
  res.render('pages/200levelcourse', {
    title: '200level'
  });
});

router.get('/300level', function (req, res, next) {
  res.render('pages/300levelcourse', {
    title: '300level'
  });
});

router.get('/400level', function (req, res, next) {
  res.render('pages/400levelcourse', {
    title: '400level'
  });
});

router.get('/news', function (req, res, next) {
  res.render('pages/News', {
    title: 'news'
  });
});

router.get('/buyBooks', function (req, res, next) {
  res.render('pages/BuyBooks', {
    title: 'book Shop'
  });
});

router.get('/e-library', function (req, res, next) {
  res.render('pages/ELibrary', {
    title: 'E-library'
  });
});

router.get('/login', function (req, res, next) {
  res.render('pages/login', {
    title: 'login form'
  });
});

router.get('/projectTopics', function (req, res, next) {
  res.render('pages/projectTopics', {
    title: 'Project Topics'
  });
});

router.get('/addArticle', function (req, res, next) {
  res.render('pages/addArticle', {
    title: 'Add an Article'
  });
});

module.exports = router;