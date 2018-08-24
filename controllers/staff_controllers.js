// This is the function for handling anything Staff

var Staff = require('../models/staffSchema');
const StudentSigns = require('../models/studentSchema');
const News = require('../models/newsSchema');
var async = require('async');
var multer = require('multer');
var path = require('path');

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
    Staff.findOne({
            '_id': req.session.staff
        })
        .exec(function (err, result) {
            res.render('staffs/staff_home', {
                title: 'Staff Home Page',
                staff_session: req.session.staff,
                staff_firstname: result.firstname
            })
        })

};

//--------------------------------------------------------------------------------------------

// staff signup GET
exports.staff_signup_get = function (req, res, next) {
    res.render('homefile/staff_signup', {
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
            var fullPath = "files/" + req.file.filename;
            // Create a Staff object with escaped and trimmed data.
            var freedom = new Staff({
                email: req.body.email,
                surname: req.body.surname,
                firstname: req.body.firstname,
                staff_id: req.body.staff_id,
                gender: req.body.gender,
                phone: req.body.phone,
                photo: fullPath,
                bio: req.body.bio,
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
    res.render('homefile/login_staff', {
        title: 'staff_signUp'
    });
};

// staff login POST
exports.staff_login_post = function (req, res, next) {
    Staff.findOne({
        'email': req.body.email
    }, function (err, blade) {

        if (!blade) {
            res.render('homefile/login_staff', {
                title: 'Staff_Login',
                ohno: "Your Email is incorrect..."
            });
            return;
        } else if (blade.staff_id !== req.body.staff_id) {
            // staff_id is incorrect
            res.render('homefile/login_staff', {
                title: 'Staff_Login',
                ohno: 'Staff_Id is Incorrect'
            })
        } else if (blade.password !== req.body.password) {
            //password is incorrect
            res.render('homefile/login_staff', {
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
    Staff.findById(req.params.id)
        .exec(function (err, results) {
            if (err) {
                return next(err);
            } // Error in API usage.
            if (results == null) { // No results.
                console.log('There are no admin');
                var err = new Error('You are not a Staff');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('staffs/staff_profiler', {
                title: 'Staff Profile',
                staff_session: req.session.staff,
                staff_email: results.email,
                staff_surname: results.surname,
                staff_firstname: results.firstname,
                staff_id: results.staff_id,
                staff_gender: results.gender,
                staff_phone: results.phone,
                staff_photo: results.photo
            });
        })

};

// GET the names of every student in Tabular form
exports.list_students = function (req, res, next) {
    StudentSigns.find()
        .sort([
            ['level', 'ascending']
        ])
        .exec(
            function (err, swag) {
                if (err) {
                    return next(err);
                }
                res.render('staffs/list_student', {
                    staff_session: req.session.staff,
                    title: "Complete List of Student",
                    slow: swag
                });
            }
        )
}

// GET Profile  of a student
exports.view_student_profile = function (req, res, next) {
    StudentSigns.findById(req.params.id)
        .exec(
            function (err, swag) {
                if (err) {
                    return next(err);
                }
                console.log(swag)
                res.render('staffs/view_students', {
                    staff_session: req.session.staff,
                    title: "Student Profile",
                    email: swag.email,
                    surname: swag.surname,
                    firstname: swag.firstname,
                    matnumber: swag.matnumber,
                    level: swag.level,
                    gender: swag.gender,
                    phone: swag.phone,
                    photo: function () {
                        if (!swag.photo) {
                            swag.photo = "../images/psylogo4.jpg";
                            return swag.photo;
                        } else {
                            return swag.photo;
                        }
                    }
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
            res.redirect('/staffhome');
        }
        res.render('staffs/list_100_students', {
            staff_session: req.session.staff,
            title: "Complete List of 100 Student",
            slow: swagger,
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
            res.redirect('/staffhome');
        }
        res.render('staffs/list_200_students', {
            staff_session: req.session.staff,
            title: "Complete List of 200 Student",
            slow: swagger,
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
            res.redirect('/staffhome');
        }
        res.render('staffs/list_300_students', {
            staff_session: req.session.staff,
            title: "Complete List of 300 Student",
            slow: swagger,
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
            res.redirect('/staffhome');
        }
        res.render('staffs/list_400_students', {
            staff_session: req.session.staff,
            title: "Complete List of 400 Student",
            slow: swagger,
        });
    })
}

// function for getting the names of every staff
exports.list_staffs = function (req, res, next) {
    Staff.find()
        .exec(function (err, swag) {
            if (err) {
                return next(err);
            }
            if (swag == null) {
                res.redirect('/staffhome');
            }
            res.render('staffs/list_staffs', {
                staff_session: req.session.staff,
                title: "Complete List of Staffs",
                slow: swag,
            });
        });
}

// GET Profile of a Particular Staff
exports.view_staff_profile = function (req, res, next) {
    Staff.findById(req.params.id)
        .exec(
            function (err, swag) {
                if (err) {
                    return next(err);
                }
                console.log(swag)
                res.render('staffs/view_staffss', {
                    staff_session: req.session.staff,
                    title: "Staff Profile",
                    email: swag.email,
                    surname: swag.surname,
                    firstname: swag.firstname,
                    staff_id: swag.staff_id,
                    gender: swag.gender,
                    phone: swag.phone,
                    photo: function () {
                        if (!swag.photo) {
                            swag.photo = "../images/psylogo4.jpg";
                            return swag.photo;
                        } else {
                            return swag.photo;
                        }
                    }
                });
            }
        )
}

// GET Admin latest NEWS
exports.get_last_news = function (req, res, next) {
    News.find({}, function (err, release) {
        if (err) {
            return next(err);
        }
        if (release == null) {
            res.send('There is no NEWS Content');
        }
        res.render('staffs/staff_read_news', {
            staff_session: req.session.staff,
            title: 'Psychology News',
            newspaper: release
        });
    })
}

exports.staff_get_project_topics = function (req, res, next) {
    res.render('staffs/staff_projecttopic', {
        title: "Staff Project Tpoics",
        allowed: req.session.staff
    })
}

exports.upload_projects = function (req, res, next) {
    res.render('staffs/upload_projects', {
        title: "Staff Upload Projects",
        staff_session: req.session.staff
    })
}

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