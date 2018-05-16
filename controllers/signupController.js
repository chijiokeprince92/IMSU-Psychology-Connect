// this is the controller for signing bopth students and staffs on the website

var staff_signup = require('../models/staffSchema');
var staff_login = require('../models/staffLogin');


exports.student = function (req, res, next) {
    res.render('pages/student_signup', {
        title: 'student_signup'
    });
};

exports.staff = function (req, res, next) {
    res.render('pages/staff_signup', {
        title: 'staff_signUp'
    });
};