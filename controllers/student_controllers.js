// this is the controller for handling anything student 


var StudentSigns = require('../models/studentSchema');
var async = require('async');

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');


//---------------------------------------------------------------------------------
// this functions checks the continuity of the session
exports.loginRequired = function (req, res, next) {
    if (!req.session.student) {
        res.redirect('login');
    } else {
        next();
    }
}


// this function ensures that another user does not tamper with a user's account
exports.ensureCorrectuser = function (req, res, next) {
    if (req.session.student !== req.params.id) {
        res.redirect('login');
    } else {
        next();
    }
}

//----------------------------------------------------------------------------
// GET the Student signup form
exports.student_signup_get = function (req, res, next) {
    res.render('student/student_signup', {
        title: 'student_signup'
    });
};


// handle POST request for the Student signup form
exports.student_signup_post = [
    body('email').isLength({
        min: 1
    }).trim().withMessage('email must be specified.'),
    body('surname').isLength({
        min: 1
    }).trim().withMessage('Surname must be specified.'),
    body('firstname').isLength({
        min: 1
    }).trim().withMessage('firstname must be specified.'),
    body('matnumber').isLength({
        min: 1
    }).trim().withMessage('matnumber must be specified.'),
    body('level').isLength({
        min: 1
    }).trim().withMessage('level must be specified.'),
    body('gender').isLength({
        min: 1
    }).trim().withMessage('gender must be specified.'),
    body('phone').isLength({
        min: 1
    }).trim().withMessage('phone must be specified.'),
    body('password').isLength({
        min: 1
    }).trim().withMessage('password must be specified.'),

    // Sanitize the fields
    sanitizeBody('email').trim().escape(),
    sanitizeBody('surname').trim().escape(),
    sanitizeBody('firstname').trim().escape(),
    sanitizeBody('matnumber').trim().escape(),
    sanitizeBody('level').trim().escape(),
    sanitizeBody('gender').trim().escape(),
    sanitizeBody('phone').trim().escape(),
    sanitizeBody('password').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('student/student_signup', {
                title: 'Create Student',
                student: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create an Student object with escaped and trimmed data.
            var qualified = new StudentSigns({
                email: req.body.email,
                surname: req.body.surname,
                firstname: req.body.firstname,
                matnumber: req.body.matnumber,
                level: req.body.level,
                gender: req.body.gender,
                phone: req.body.phone,
                password: req.body.password
            });
            qualified.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to login page.
                res.redirect('login');
            });
        }
    }
];

//----------------------------------------------------------------------
// function for Student Login GET
exports.get_login_form = function (req, res, next) {
    res.render('student/login', {
        title: 'Login form',
    });
}

// function for Student Login POST
exports.test_login = function (req, res, next) {
    StudentSigns.findOne({
        'email': req.body.email
    }, function (err, glad) {
        if (err) {
            return next(err);
        } else if (glad == null) {
            res.render('student/login', {
                title: 'Student Login',
                ohno: 'Your email was not found on the database'
            })
        } else if (glad.password !== req.body.password) {
            //password is incorrect
            res.render('student/login', {
                title: 'Login',
                ohno: 'Password is incorrect'
            })
        } else if (glad && glad.password == req.body.password) {
            req.session.student = glad.id;
            res.render('student/home', {
                title: 'HomePage',
                allowed: req.session.student
            });
        } else {
            res.redirect('/login');
        }
    });

};

// Profile page for a specific Student.
exports.profiler = function (req, res, next) {

    async.parallel({
        studentsignee: function (callback) {
            StudentSigns.findById(req.params.id)
                .exec(callback)
        }

    }, function (err, results) {
        if (err) {
            return next(err);
        } // Error in API usage.
        else if (results.studentsignee == null) { // No results.
            var err = new Error('Student not found');
            err.status = 404;
            return next(err);
        } else {
            // Successful, so render.
            res.render('student/profiler', {
                allowed: req.session.student,
                title: 'Student Profile',
                user: results.studentsignee.id,
                graceemail: results.studentsignee.email,
                gracesurname: results.studentsignee.surname,
                gracefirstname: results.studentsignee.firstname,
                gracematnumber: results.studentsignee.matnumber,
                gracelevel: results.studentsignee.level,
                gracegender: results.studentsignee.gender,
                gracephone: results.studentsignee.phone
            });
        }
    });


};


//-------------------------------------------------------------------------
// NAPS Group Chat function
exports.chat = function (req, res, next) {
    StudentSigns.findOne({
        '_id': req.session.student
    }, function (err, senior) {
        if (err) {
            return next(err);
        } else if (senior.level == 100) {
            res.render('student/chat100', {
                title: "100 Level Chat Group",
                message: " 100 Level NAPS Group Chat !!",
                allowed: req.session.student
            });
        } else if (senior.level == 200) {
            res.render('student/chat200', {
                title: "200 Level Chat Group",
                message: " 200 Level NAPS Group Chat !!",
                allowed: req.session.student
            });
        } else if (senior.level == 300) {
            res.render('student/chat300', {
                title: "300 Level Chat Group",
                message: " 300 Level NAPS Group Chat !!",
                allowed: req.session.student
            });
        } else if (senior.level == 400) {
            res.render('student/chat400', {
                title: "400 Level Chat Group",
                message: " 400 Level NAPS Group Chat !!",
                allowed: req.session.student
            });
        } else {
            res.redirect('login');
        }
    });
}


// function for checking students results
exports.student_result = function (req, res, next) {
    async.parallel({
        studentresult: function (callback) {
            StudentSigns.findById(req.session.student)
                .exec(callback)
        }

    }, function (err, myresult) {
        if (err) {
            return next(err);
        }
        if (studentresult) {
            res.render('student/student_result', {
                title: 'Personal Result',
                message: myresult.surname
            })
        }
    })
}

// to Log-Out Students from the site
exports.logout = function (req, res, next) {
    if (req.session.student) {
        req.session.destroy();
    }
    res.redirect('/');
}