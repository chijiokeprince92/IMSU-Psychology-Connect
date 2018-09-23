const Admins = require('../models/adminSchema');
const StudentSigns = require('../models/studentSchema');
const Staff = require('../models/staffSchema');
const News = require('../models/newsSchema');
const Project = require('../models/projectSchema');
const Courses = require('../models/coursesSchema');
const async = require('async');
var multer = require('multer');
var path = require('path');

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

//------------------------------------------------------------------------------
//ADMIN Functions

// Checking for Admin logins and verifications
exports.admin_session_force = function (req, res, next) {
    if (!req.session.admin) {
        res.redirect('/adminlogin');
    } else {
        next();
    }
}
//--------------------------------------------------------------------------

// GET Admin Signup Form
exports.admin_signup_get = function (req, res, next) {
    res.render('admin/admin_signup', {
        title: 'ADMIN_signUp'
    });
};
//------------------------------------------------------------------------------------

// POST Admin Signup form
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
//----------------------------------------------------------------------------------------------

// GET Admin login form
exports.admin_login_get = function (req, res, next) {
    res.render('admin/admin_login', {
        title: 'Admin Login'
    })
}

// POST Admin login form
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

//--------------------------------------------------------------------------
// Display Author update form on GET.
exports.admin_update_get = function (req, res, next) {

    Admins.findById(req.params.id, function (err, coursey) {
        if (err) {
            return next(err);
        }
        if (coursey == null) { // No results.
            var err = new Error('Admin not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('admin/admin_update', {
            title: 'Update Profile',
            admin: req.session.admin,
            coursey: coursey
        });

    });
};

exports.admin_update_post = function (req, res, next) {
    var judge = new Admins({
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        password: req.body.password,
        _id: req.params.id
    });
    Admins.findByIdAndUpdate(req.params.id, judge, {
        new: true
    }, function (err, adminupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(adminupdate.url);
    });
}

//----------------------------------------------------------------------------------------

//GET Admin HOME Page
exports.admin = function (req, res, next) {
    async.parallel({
        didi: function (callback) {
            Admins.findOne({
                '_id': req.session.admin
            }).exec(callback);
        },
        newy: function (callback) {
            News.count().exec(callback);
        }
    }, function (err, name) {
        if (err) {
            return next(err);
        }
        res.render('admin/admin', {
            title: 'Admin Page',
            admin: req.session.admin,
            name: name.didi.surname,
            news: name.newy
        });
    })
}

// GET Profile page for a specific Admin.
exports.profiler = function (req, res, next) {
    Admins.findById(req.params.id)
        .exec(function (err, results) {
            if (err) {
                return next(err);
            } // Error in API usage.
            if (results == null) { // No results.
                console.log('There are no admin');
                var err = new Error('You are not an Admin');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('admin/admin_profile', {
                title: 'Admin Profile',
                admin: req.session.admin,
                admin_email: results.email,
                admin_surname: results.surname,
                admin_firstname: results.firstname,
                admin_verify: results.verify,
                admin_gender: results.gender,
                admin_phone: results.phone,
                urlline: results.id
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
                res.render('admin/list_student', {
                    admin: req.session.admin,
                    title: "Complete List of Student",
                    slow: swag,
                    levy: "ALL PSYCHOLOGY STUDENTS"
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
                res.render('admin/view_student', {
                    admin: req.session.admin,
                    title: "Student Profile",
                    email: swag.email,
                    surname: swag.surname,
                    firstname: swag.firstname,
                    matnumber: swag.matnumber,
                    level: swag.level,
                    gender: swag.gender,
                    phone: swag.phone,
                    quote: swag.bio,
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
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 100 Student",
            message: "These are the List of All 100 Level NAPS Students",
            slow: swagger,
            levy: "100 LEVEL STUDENTS"
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
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 200 Student",
            message: "These are the List of All 200 Level NAPS Students",
            slow: swagger,
            levy: "200 LEVEL STUDENTS"
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
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 300 Student",
            message: "These are the List of All 300 Level NAPS Students",
            slow: swagger,
            levy: "300 LEVEL STUDENTS"
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
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 400 Student",
            message: "These are the List of All 400 level NAPS Students",
            slow: swagger,
            levy: "400 LEVEL STUDENTS"
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
                res.redirect('/hercules/gladiators/spartans/admin');
            }
            res.render('admin/list_staff', {
                admin: req.session.admin,
                title: "Complete List of Staffs",
                slow: swag,
            });
        });
}

// GET Profile of a Particular Staff
exports.view_staff_profile = function (req, res, next) {
    async.parallel({
        coursey: function (callback) {
            Courses.find({
                'lecturer': req.params.id
            }).exec(callback);
        },
        staffy: function (callback) {
            Staff.findById(req.params.id).exec(callback);
        }
    }, function (err, swag) {
        if (err) {
            return next(err);
        }
        res.render('admin/view_staffs', {
            admin: req.session.admin,
            title: "Staff Profile",
            email: swag.staffy.email,
            surname: swag.staffy.surname,
            firstname: swag.staffy.firstname,
            staff_id: swag.staffy.staff_id,
            gender: swag.staffy.gender,
            phone: swag.staffy.phone,
            coursess: swag.coursey,
            photo: function () {
                if (!swag.staffy.photo) {
                    swag.staffy.photo = "../images/psylogo4.jpg";
                    return swag.staffy.photo;
                } else {
                    return swag.staffy.photo;
                }
            }
        });
    });
}



//---------------------------------------------------------------------------------------------

// GET Admin form for Project Upload
exports.get_upload_project = function (req, res, next) {
    res.render('admin/upload_project', {
        title: "Upload Project Topic",
        admin: req.session.admin
    })
}

// POST Admin form for Project Upload
exports.post_upload_project = function (req, res, next) {
    var fullPath = "./project_topics/" + req.file.filename;
    var projectile = new Project({
        project: fullPath,
        topic: req.body.topic,
        description: req.body.description
    });
    console.log(projectile);
    projectile.save(function (err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.redirect('/getprojecttopicss');
    });

}

// GET Admin PROJECT Topics
exports.get_project_topics = function (req, res, next) {
    Project.find({}, function (err, release) {
        if (err) {
            return next(err);
        }
        if (release == null) {
            res.send('There is no PROJECT Content');
        }
        res.render('admin/project_topics', {
            admin: req.session.admin,
            title: 'Psychology Project Topics',
            projectss: release
        });
    })
}

exports.delete_project = function (req, res, next) {
    Project.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/getprojecttopicss');
    });
}

//----------------------------------------------------------------------------
// GET Admin form for Posting NEWS
exports.get_upload_news = function (req, res, next) {
    res.render('admin/admin_get_news', {
        title: 'Admin Upload Projects',
        admin: req.session.admin
    });
}

// POST Admin form for NEWS 
exports.post_upload_news = function (req, res, next) {
    var fullPath = "./newsproject/" + req.file.filename;
    var latest = new News({
        picture: fullPath,
        heading: req.body.heading,
        passage: req.body.passage,
        passage1: req.body.passage1,
        passage2: req.body.passage2
    });
    latest.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/getlastnews');
    });
}

exports.news_edit_get = function (req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function (err, newy) {
        if (err) {
            return next(err);
        }
        res.render('admin/edit_news', {
            admin: req.session.admin,
            title: 'EDIT NEWS',
            newy: newy
        });
    })

}

exports.news_edit_post = function (req, res, next) {
    var latest = new News({
        heading: req.body.heading,
        passage: req.body.passage,
        passage1: req.body.passage1,
        passage2: req.body.passage2,
        _id: req.params.id
    });
    News.findByIdAndUpdate(req.params.id, latest, {}, function (err, newsupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(newsupdate.url);
    });
}

// GET Admin latest NEWS
exports.get_last_news = function (req, res, next) {
    News.find({}).sort([
        ['created', 'ascending']
    ]).exec(function (err, release) {
        if (err) {
            return next(err);
        }
        if (release == null) {
            res.send('There is no NEWS Content');
        }
        res.render('admin/admin_news', {
            admin: req.session.admin,
            title: 'Psychology News',
            newspaper: release
        });
    })
}

// GET Admin full NEWS
exports.get_full_news = function (req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function (err, release) {
        if (err) {
            return next(err);
        }
        res.render('admin/fullnews', {
            admin: req.session.admin,
            title: 'Psychology Full News',
            newspaper: release
        });
    })
}

exports.delete_news = function (req, res, next) {
    News.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/getlastnews');
    });
}

//----------------------------------------------------------------------
// GET Student Result Filler form
exports.student_results = function (req, res, next) {
    res.render('admin/student_result_form', {
        title: "Student result Filler",
        admin: req.session.admin
    });
}

// function for sending message to 100 level
exports.send_100 = function (req, res, next) {
    res.render('student/chat100', {
        title: "100Level Group Chat",
        admin: req.session.admin
    })
}

// function for sending messsage to 200 level
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

//ADMIN Logout Request
exports.admin_logout = function (req, res, next) {
    if (req.session.admin) {
        req.session.destroy();
    }
    res.redirect('/');
}
//------------------------------------------------------------------------------------
// ADMIN GET course registration
exports.add_courses = function (req, res, next) {
    Staff.find({}, function (err, teacher) {
        if (err) {
            return next(err);
        }
        res.render('admin/add_courses', {
            title: 'Add Courses',
            admin: req.session.admin,
            teacher: teacher
        });
    })

}

//ADMIN POST Course Registration
exports.post_course = function (req, res, next) {
    var course = new Courses({
        coursecode: req.body.coursecode,
        coursetitle: req.body.coursetitle,
        level: req.body.level,
        semester: req.body.semester,
        units: req.body.units,
        borrowed: req.body.borrowed,
        courseoutline: req.body.courseoutline
    });
    course.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(course.url);
    });
}


// GET course form for update.
exports.course_update_get = function (req, res, next) {
    async.parallel({
        coursess: function (callback) {
            Courses.findById(req.params.id)
                .exec(callback);
        },
        teacher: function (callback) {
            Staff.find({})
                .exec(callback);
        }
    }, function (err, coursey) {
        if (err) {
            return next(err);
        }
        if (coursey.coursess == null) { // No results.
            var err = new Error('Course not found');
            err.status = 404;
            return next(err);
        }
        if (coursey.teacher == null) { // No results.
            var err = new Error('Lecturer not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('admin/edit_course', {
            title: 'Update Course_Outline',
            admin: req.session.admin,
            coursey: coursey.coursess,
            teacher: coursey.teacher
        });
    });
};

//POST course form for update
exports.course_update_post = function (req, res, next) {
    var course = new Courses({
        coursecode: req.body.coursecode,
        coursetitle: req.body.coursetitle,
        level: req.body.level,
        semester: req.body.semester,
        units: req.body.units,
        borrowed: req.body.borrowed,
        lecturer: req.body.lecturer,
        courseoutline: req.body.courseoutline,
        _id: req.params.id
    });
    Courses.findByIdAndUpdate(req.params.id, course, {}, function (err, courseupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(courseupdate.url);
    });
}


//---------------------------------------------------------------------------------------------------------------------------
// GET List of 100Level Courses...
exports.get_100_courses = function (req, res, next) {
    async.parallel({
        first_semester: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('admin/list_courses', {
            title: "100 Level Courses",
            admin: req.session.admin,
            levy: 100,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective1: 'ANY TWO',
            elective2: 'ANY TWO'
        });
    });
};

// GET List of 200Level Courses...
exports.get_200_courses = function (req, res, next) {
    async.parallel({
        first_semester: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/getallcourses');
        }
        res.render('admin/list_courses', {
            title: "200 Level Courses",
            admin: req.session.admin,
            levy: 200,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective1: 'ANY TWO',
            elective2: 'ANY TWO'
        });
    });
};

// GET List of 300Level Courses...
exports.get_300_courses = function (req, res, next) {
    async.parallel({
        first_semester: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('admin/list_courses', {
            title: "300 Level Courses",
            admin: req.session.admin,
            levy: 300,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective1: 'ONE',
            elective2: 'ANY ONE'
        });
    });
};

// GET List of 400Level Courses...
exports.get_400_courses = function (req, res, next) {
    async.parallel({
        first_semester: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('admin/list_courses', {
            title: "400 Level Courses",
            admin: req.session.admin,
            levy: 400,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective2: 'ANY ONE'
        });
    });
};

// GET detailed Page for a particular course
exports.view_course = function (req, res, next) {
    Courses.findById(req.params.id)
        .exec(function (err, course) {
            if (err) {
                return next(err);
            }
            Staff.findById(course.lecturer)
                .exec(function (err, staff) {
                    if (err) {
                        return next(err);
                    }
                    res.render('admin/view_course', {
                        title: 'Psychology Course',
                        admin: req.session.admin,
                        kind: course,
                        teacher: staff
                    });
                });
        });
}