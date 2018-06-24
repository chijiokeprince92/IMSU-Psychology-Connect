// this is the controller for signing both students and staffs on the website


var StudentSigns = require('../models/studentSchema');
var async = require('async');

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');



// this functions checks the continuity of the session
exports.loginRequired = function (req, res, next) {
    if (!req.session.user_id) {
        res.redirect('login');
    } else {
        next();
    }
}


// this function ensures that another user does not tamper with a user's account
exports.ensureCorrectuser = function (req, res, next) {
    if (req.session.user_id !== req.params.id) {
        res.redirect('login');
    } else {
        next();
    }
}


// GET the Student signup form
exports.student_signup_get = function (req, res, next) {
    res.render('pages/student_signup', {
        title: 'student_signup'
    });
};


// handle the POst request for the Student signup form
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
            res.render('pages/student_signup', {
                title: 'Create Student',
                student: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
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
                // Successful - redirect to new author record.
                res.redirect('login');
            });
        }
    }
];

exports.get_login_form = function (req, res, next) {
    res.render('pages/login', {
        title: 'Login form',
    });
}

// 
exports.test_login = function (req, res, next) {
    StudentSigns.findOne({
        'email': req.body.email
    }, function (err, glad) {
        if (err) {
            return next(err);
        }
        if (glad == null) {
            var err = new Error('Student not Found');
            err.status = 404;
            return next(err);
        }
        if (glad.password !== req.body.password) {
            //password is incorrect
            res.render('pages/login', {
                title: 'Login',
                ohno: 'Password is incorrect'
            })
        }
        if (glad.password == req.body.password) {
            req.session.user_id = glad.id;
            res.redirect('/studentss/' + glad.id);
        }
    });

};

// Display detail page for a specific Student.
exports.profiler = function (req, res, next) {

    async.parallel({
        studentsignee: function (callback) {
            StudentSigns.findById(req.params.id)
                .exec(callback)
        }

    }, function (err, results) {
        var user = req.session.user_id;
        if (err) {
            return next(err);
        } // Error in API usage.
        if (results.studentsignee == null) { // No results.
            var err = new Error('Student not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render.
        res.render('pages/profiler', {
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
    });

};

// NAPS Group Chat function
exports.chat = function (req, res, next) {
    res.render('pages/chat', {
        title: "Chat",
        message: "Welcome to the NAPS Group Chat !!"
    });
}

// staff signup GET
exports.staff_signup_get = function (req, res, next) {
    res.render('pages/staff_signup', {
        title: 'staff_signUp'
    });
};

// Staff signup POST
exports.staff_signup_post = function (req, res, next) {

}

// staff login GET
exports.staff_login_get = function (req, res, next) {
    res.render('pages/staff_signup', {
        title: 'staff_signUp'
    });
};

// staff login POST
exports.staff_login_post = function (req, res, next) {

}

// this function is for counting the number of students that are registered on the website
exports.index = function (req, res) {

    async.parallel({
        onestudent_count: function (callback) {
            StudentPress.count(callback)
        }

    }, function (err, results) {
        res.render('pages/number', {
            title: 'Number of Users',
            data: results.onestudent_count
        });
    });
};