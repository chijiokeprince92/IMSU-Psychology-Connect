var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { 
  res.render('pages/home', {
    title: 'Home Page',
    text: 'This is the data coming from the index route'
  });
});

router.get('/aboutus', function(req, res, next) { 
  res.render('pages/AboutUs', {
    title: 'about psychology',
    text: 'This is the data coming from the aboutUs route'
  });
});

router.get('/library', function(req, res, next) { 
  res.render('pages/Library', {
    title: 'library',
    text: 'This is the data coming from the index route'
  });
});

router.get('/student_signup', function(req, res, next) { 
  res.render('pages/student_signup', {
    title: 'student_signup',
    text: 'This is the data coming from the student_signup route'
  });
});

router.get('/staff_signup', function(req, res, next) { 
  res.render('pages/staff_signup', {
    title: 'staff_signUp',
    text: 'This is the data coming from the staff_signup route'
  });
});

router.get('/100level', function(req, res, next) { 
  res.render('pages/100levelcourse', {
    title: '100level',
    text: 'This is the data coming from the first-year route'
  });
});

router.get('/200level', function(req, res, next) { 
  res.render('pages/200levelcourse', {
    title: '200level',
    text: 'This is the data coming from the second-year route'
  });
});

router.get('/300level', function(req, res, next) { 
  res.render('pages/300levelcourse', {
    title: '300level',
    text: 'This is the data coming from the third-year route'
  });
});

router.get('/400level', function(req, res, next) { 
  res.render('pages/400levelcourse', {
    title: '400level',
    text: 'This is the data coming from the fourth-year route'
  });
});

router.get('/news', function(req, res, next) { 
  res.render('pages/News', {
    title: 'news',
    text: 'This is the data coming from the news route'
  });
});

router.get('/buyBooks', function(req, res, next) { 
  res.render('pages/BuyBooks', {
    title: 'buyBooksHere',
    text: 'This is the data coming from the buyBook route'
  });
});

router.get('/e-library', function(req, res, next) { 
  res.render('pages/ELibrary', {
    title: 'E-learning',
    text: 'This is the data coming from the e-library route'
  });
});

router.get('/login', function(req, res, next) { 
  res.render('pages/login', {
    title: 'login',
    text: 'This is the data coming from the login route'
  });
});

router.get('/projectTopics', function(req, res, next) { 
  res.render('pages/projectTopics', {
    title: 'projects',
    text: 'This is the data coming from the projects route'
  });
});

router.get('/addArticle', function(req, res, next) { 
  res.render('pages/addArticle', {
    title: 'Addarticle',
    text: 'This is the data coming from the article route'
  });
});

module.exports = router;