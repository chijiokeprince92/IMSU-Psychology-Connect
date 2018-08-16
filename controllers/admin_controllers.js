const Admins = require('../models/adminSchema');
const StudentSigns = require('../models/studentSchema');
const Staff = require('../models/staffSchema');
const async = require('async');

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

//------------------------------------------------------------------------------
//ADMIN Functions


exports.admin_session_force = function (req, res, next) {
    if (!req.session.admin) {
        res.redirect('/adminlogin');
    } else {
        next();
    }
}
//--------------------------------------------------------------------------

// staff signup GET
exports.admin_signup_get = function (req, res, next) {
    res.render('admin/admin_signup', {
        title: 'ADMIN_signUp'
    });
};


// handle the POST request for the Staff signup form
exports.admin_signup_post = [
    body('email').isLength({
        min: 1
    }).trim().withMessage('email must be specified.'),
    body('surname').isLength({
        min: 1
    }).trim().withMessage('Surname must be specified.'),
    body('firstname').isLength({
        min: 1
    }).trim().withMessage('firstname must be specified.'),
    body('gender').isLength({
        min: 4
    }).trim().withMessage('gender must be specified.'),
    body('verify').isLength({
        min: 1
    }).trim().withMessage('verification_ID must be specified.'),
    body('password').isLength({
        min: 1
    }).trim().withMessage('password must be specified.'),

    // Sanitize the fields
    sanitizeBody('email').trim().escape(),
    sanitizeBody('surname').trim().escape(),
    sanitizeBody('firstname').trim().escape(),
    sanitizeBody('gender').trim().escape(),
    sanitizeBody('verify').trim().escape(),
    sanitizeBody('password').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('admin/admin_signup', {
                title: 'Create ADMIN',
                admin: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create a Staff object with escaped and trimmed data.
            var judge = new Admins({
                email: req.body.email,
                surname: req.body.surname,
                firstname: req.body.firstname,
                gender: req.body.gender,
                verify: req.body.verify,
                password: req.body.password
            });
            judge.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to ADMIN login page.
                res.redirect('/adminlogin');
            });
        }
    }
];

exports.admin_login_get = function (req, res, next) {
    res.render('admin/admin_login', {
        title: 'Admin Login'
    })
}

exports.admin_login_post = function (req, res, next) {
    Admins.findOne({
        'verify': req.body.verify
    }, function (err, sydney) {
        if (err) {
            return next(err);
        } else if (sydney == null) {
            res.redirect('/adminlogin');
        } else if (sydney.password != req.body.password) {
            res.redirect('/adminlogin');
        } else {
            req.session.admin = sydney.id;
            res.render('admin/admin', {
                title: 'Admin Page',
                admin: req.session.admin
            })
        }
    })
}

exports.admin = function (req, res, next) {
    res.render('admin/admin', {
        title: 'Admin Page',
        admin: req.session.admin
    })
}

// this function is for counting the number of students that are registered on the website
exports.index = function (req, res) {
    async.parallel({
        onestudent_count: function (callback) {
            StudentSigns.count(callback)
        }

    }, function (err, results) {
        res.render('admin/number', {
            admin: req.session.admin,
            title: 'Number of Users',
            data: results.onestudent_count
        });
    });
};

// function for getting the names of every student
exports.list_students = function (req, res, next) {
    StudentSigns.find({},
        function (err, swag) {
            if (err) {
                return next(err);
            }
            res.render('admin/list_student', {
                admin: req.session.admin,
                title: "Complete List of Student",
                slow: swag,
                identify: swag._id,
                email: swag.email,
                surname: swag.surname,
                firstname: swag.firstname,
                matnumber: swag.matnumber,
                level: swag.level,
                gender: swag.gender,
                phone: swag.phone
            });
        }
    )
}

//Functions for displaying students by their levels

exports.list_100_student = function (req, res, next) {
    StudentSigns.find({
        'level': 100
    }, function (err, swagger) {
        if (err) {
            return next(err);
        }
        if (swagger == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_100_student', {
            admin: req.session.admin,
            title: "Complete List of 100 Student",
            slow: swagger,
            identify: swagger._id,
            email: swagger.email,
            surname: swagger.surname,
            firstname: swagger.firstname,
            matnumber: swagger.matnumber,
            level: swagger.level,
            gender: swagger.gender,
            phone: swagger.phone
        });
    })
}

exports.list_200_student = function (req, res, next) {
    StudentSigns.find({
        'level': 200
    }, function (err, swagger) {
        if (err) {
            return next(err);
        }
        if (swagger == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_200_student', {
            admin: req.session.admin,
            title: "Complete List of 200 Student",
            slow: swagger,
            identify: swagger._id,
            email: swagger.email,
            surname: swagger.surname,
            firstname: swagger.firstname,
            matnumber: swagger.matnumber,
            level: swagger.level,
            gender: swagger.gender,
            phone: swagger.phone
        });
    })
}

exports.list_300_student = function (req, res, next) {
    StudentSigns.find({
        'level': 300
    }, function (err, swagger) {
        if (err) {
            return next(err);
        }
        if (swagger == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_300_student', {
            admin: req.session.admin,
            title: "Complete List of 300 Student",
            slow: swagger,
            identify: swagger._id,
            email: swagger.email,
            surname: swagger.surname,
            firstname: swagger.firstname,
            matnumber: swagger.matnumber,
            level: swagger.level,
            gender: swagger.gender,
            phone: swagger.phone
        });
    })
}

exports.list_400_student = function (req, res, next) {
    StudentSigns.find({
        'level': 400
    }, function (err, swagger) {
        if (err) {
            return next(err);
        }
        if (swagger == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_400_student', {
            admin: req.session.admin,
            title: "Complete List of 400 Student",
            slow: swagger,
            identify: swagger._id,
            email: swagger.email,
            surname: swagger.surname,
            firstname: swagger.firstname,
            matnumber: swagger.matnumber,
            level: swagger.level,
            gender: swagger.gender,
            phone: swagger.phone
        });
    })
}

// this function is for counting the number of staffs that are registered on the website
exports.staff_index = function (req, res) {

    async.parallel({
        onestaff_count: function (callback) {
            Staff.count(callback)
        }

    }, function (err, results) {
        res.render('staffs/staff_number', {
            title: 'Number of Users',
            data: results.onestaff_count,
            admin: req.session.admin
        });
    });
};


// function for getting the names of every staff
exports.list_staffs = function (req, res, next) {
    Staff.find({},
        function (err, swag) {
            if (err) {
                return next(err);
            }
            if (swag == null) {
                res.redirect('/hercules/gladiators/spartans/admin');
            }
            res.render('admin/list_staff', {
                admin: req.session.admin,
                title: "Complete List of Staffs",
                message: "Complete List of Students",
                slow: swag,
                email: swag.email,
                surname: swag.surname,
                firstname: swag.firstname,
                matnumber: swag.staff_id,
                gender: swag.gender,
                phone: swag.phone
            });

        }
    )
}


// Profile page for a specific Admin.
exports.profiler = function (req, res, next) {

    async.parallel({
        admin_profile: function (callback) {
            Admins.findById(req.params.id)
                .exec(callback)
        }

    }, function (err, results) {
        if (err) {
            return next(err);
        } // Error in API usage.
        else if (results.admin_profile == null) { // No results.
            console.log('There are no admin');
            var err = new Error('You are not an Admin');
            err.status = 404;
            return next(err);
        } else {
            // Successful, so render.
            res.render('admin/admin_profile', {
                title: 'Admin Profile',
                admin: req.session.admin,
                admin_email: results.admin_profile.email,
                admin_surname: results.admin_profile.surname,
                admin_firstname: results.admin_profile.firstname,
                admin_verify: results.admin_profile.verify,
                admin_gender: results.admin_profile.gender,
                admin_phone: results.admin_profile.phone
            });
        }
    });
};

// Functions for rendering the student results filler form
exports.student_results = function (req, res, next) {
    res.render('admin/student_result_form', {
        title: "Student result Filler",
        admin: req.session.admin
    });
}

// function for sending message to all levels
exports.send_100 = function (req, res, next) {
    res.render('student/chat100', {
        title: "100Level Group Chat",
        admin: req.session.admin
    })
}

exports.send_200 = function (req, res, next) {
    res.render('student/chat200', {
        title: "200 Level Group Chat",
        admin: req.session.admin
    });
}

exports.send_300 = function (req, res, next) {
    res.render('student/chat300', {
        title: "300Level Group Chat",
        admin: req.session.admin
    });
}

exports.send_400 = function (req, res, next) {
    res.render('student/chat400', {
        title: "400Level Group chat",
        admin: req.session.admin
    });
}

exports.admin_logout = function (req, res, next) {
    if (req.session.admin) {
        req.session.destroy();
    }
    res.redirect('/');
}