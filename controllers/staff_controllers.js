// This is the function for handling anything Staff

var Staff = require('../models/staffSchema');
var async = require('async');

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');


//--------------------------------------------------------------------------------------------

exports.staffloginRequired = function (req, res, next) {
    if (!req.session.staff) {
        res.redirect('/stafflogin');
    } else {
        return next();
    }
}
//----------------------------------------------------------------------------------


exports.staff_home = function (req, res, next) {
    res.render('staffs/staff_home', {
        title: 'Staff Home Page',
        staff_session: req.session.staff
    })
};


// staff signup GET
exports.staff_signup_get = function (req, res, next) {
    res.render('staffs/staff_signup', {
        title: 'staff_signUp'
    });
};


// handle the POST request for the Staff signup form
exports.staff_signup_post = [
    body('email').isLength({
        min: 1
    }).trim().withMessage('email must be specified.'),
    body('surname').isLength({
        min: 1
    }).trim().withMessage('Surname must be specified.'),
    body('firstname').isLength({
        min: 1
    }).trim().withMessage('firstname must be specified.'),
    body('staff_id').isLength({
        min: 1
    }).trim().withMessage('staff_id must be specified.'),
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
    sanitizeBody('staff_id').trim().escape(),
    sanitizeBody('gender').trim().escape(),
    sanitizeBody('phone').trim().escape(),
    sanitizeBody('password').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('staffs/staff_signup', {
                title: 'Create Staff',
                staff: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create a Staff object with escaped and trimmed data.
            var freedom = new Staff({
                email: req.body.email,
                surname: req.body.surname,
                firstname: req.body.firstname,
                staff_id: req.body.staff_id,
                gender: req.body.gender,
                phone: req.body.phone,
                password: req.body.password
            });
            freedom.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to Staff login page.
                res.redirect('/stafflogin');
            });
        }
    }
];

//--------------------------------------------------------------------

// staff login GET
exports.staff_login_get = function (req, res, next) {
    res.render('staffs/login_staff', {
        title: 'staff_signUp'
    });
};

// staff login POST
exports.staff_login_post = function (req, res, next) {
    Staff.findOne({
        'email': req.body.email
    }, function (err, blade) {

        if (!blade) {
            res.render('staffs/login_staff', {
                title: 'Staff_Login',
                ohno: "Your Email is incorrect..."
            });
            return;
        } else if (blade.staff_id !== req.body.staff_id) {
            // staff_id is incorrect
            res.render('staffs/login_staff', {
                title: 'Staff_Login',
                ohno: 'Staff_Id is Incorrect'
            })
        } else if (blade.password !== req.body.password) {
            //password is incorrect
            res.render('staffs/login_staff', {
                title: 'Staff_Login',
                ohno: 'Password is incorrect'
            })
        } else if (blade && blade.staff_id == req.body.staff_id && blade.password == req.body.password) {
            req.session.staff = blade.id;
            res.redirect('/staffhome');
        } else {
            res.redirect('/stafflogin');
        }
    });

};

//---------------------------------------------------------------------------------------------
// Display detail page for a specific Staff.
exports.staff_profiler = function (req, res, next) {

    async.parallel({
        staffsignee: function (callback) {
            Staff.findById(req.params.id)
                .exec(callback)
        }

    }, function (err, straff) {
        if (err) {
            return next(err);
        } // Error in API usage.
        else if (straff.staffsignee == null) { // No results.
            var err = new Error('Student not found');
            err.status = 404;
            return next(err);
        } else {
            // Successful, so render.
            res.render('staffs/staff_profiler', {
                staff_session: req.session.staff,
                title: 'Staff Profile',
                user: straff.staffsignee.id,
                graceemail: straff.staffsignee.email,
                gracesurname: straff.staffsignee.surname,
                gracefirstname: straff.staffsignee.firstname,
                gracestaff_id: straff.staffsignee.staff_id,
                gracegender: straff.staffsignee.gender,
                gracephone: straff.staffsignee.phone
            });
        }
    });

};

// to Log-Out Staffs from the site
exports.staff_logout = function (req, res, next) {
    if (req.session.staff) {
        req.session.destroy();
    }
    res.redirect('/');
}

//..................................................................................................

//----------------------------------------------------------------------------------------------
//Staffs Pages 

exports.staff_onelevel = function (req, res, next) {
    res.render('staffs/staff_100level', {
        title: '100level',
        staff_session: req.session.staff
    });
};

exports.staff_twolevel = function (req, res, next) {
    res.render('staffs/staff_200level', {
        title: '200level',
        staff_session: req.session.staff
    });
};

exports.staff_threelevel = function (req, res, next) {
    res.render('staffs/staff_300level', {
        title: '300level',
        staff_session: req.session.staff
    });
};

exports.staff_fourlevel = function (req, res, next) {
    res.render('staffs/staff_400level', {
        title: '400level',
        staff_session: req.session.staff
    });
};

exports.staff_history = function (req, res, next) {
    res.render('staffs/staff_history', {
        title: 'History of NAPS',
        staff_session: req.session.staff
    });
};

exports.staff_objectives = function (req, res, next) {
    res.render('staffs/staff_objectives', {
        title: 'objectives of NAPS',
        staff_session: req.session.staff
    });
};

exports.staff_guidelines = function (req, res, next) {
    res.render('staffs/staff_guidelines', {
        title: 'Guidelines of NAPS',
        staff_session: req.session.staff
    });
};

exports.staff_orientation = function (req, res, next) {
    res.render('staffs/staff_orientation', {
        title: 'Orientation',
        staff_session: req.session.staff
    });
};

exports.staff_exam = function (req, res, next) {
    res.render('staffs/staff_exams', {
        title: 'Examination Rules and Regulations',
        staff_session: req.session.staff
    });
};


exports.staff_libinfo = function (req, res, next) {
    res.render('staffs/staff_libraryinfo', {
        title: 'Library Informations',
        staff_session: req.session.staff
    });
};

exports.staff_library = function (req, res, next) {
    res.render('staffs/staff_library', {
        title: 'library',
        staff_session: req.session.staff
    });
};

exports.staff_news = function (req, res, next) {
    res.render('staffs/staff_news', {
        title: 'news',
        staff_session: req.session.staff
    });
};

exports.staff_elibrary = function (req, res, next) {
    res.render('staffs/staff_elibrary', {
        title: 'E-library',
        staff_session: req.session.staff
    });
};

exports.staff_project = function (req, res, next) {
    res.render('staffs/staff_projecttopic', {
        title: 'Project Topics',
        staff_session: req.session.staff
    });
};






//---------------------------------------------------------------------------------------------
exports.staff_profile = function (req, res, next) {
    Staff.findById(req.session.staff,
        function (err, staff) {
            if (err) {
                return next(err);
            } // Error in API usage.
            else if (straff.staffsignee == null) { // No results.
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            } else {
                // Successful, so render.
                res.render('staffs/staff_profiler', {
                    staff_session: req.session.staff,
                    title: 'Staff Profile',
                    user: straff.staffsignee.id,
                    graceemail: straff.staffsignee.email,
                    gracesurname: straff.staffsignee.surname,
                    gracefirstname: straff.staffsignee.firstname,
                    gracestaff_id: straff.staffsignee.staff_id,
                    gracegender: straff.staffsignee.gender,
                    gracephone: straff.staffsignee.phone
                });
            }
        }
    )
}