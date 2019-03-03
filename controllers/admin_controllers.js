const Admins = require('../models/adminSchema');
const StudentSigns = require('../models/studentSchema');
const Staff = require('../models/staffSchema');
const News = require('../models/newsSchema');
const Project = require('../models/projectSchema');
const Courses = require('../models/coursesSchema');
const Timetable = require('../models/timetableSchema');
const Result = require('../models/resultSchema');
const async = require('async');
const path = require('path');

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
exports.admin_session_force = function(req, res, next) {
        if (!req.session.admin) {
            res.redirect('/admin/login');
        } else {
            next();
        }
    }
    //--------------------------------------------------------------------------

// GET Admin Signup Form
exports.admin_signup_get = function(req, res, next) {
    res.render('admin/admin_signup', {
        title: 'ADMIN_SIGNUP',
        layout: "less_layout"
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
            judge.save(function(err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to ADMIN login page.
                req.flash('message', "Your signup was successful, Login to have full access");
                res.redirect('/admin/login');
            });
        }
    }
];
//----------------------------------------------------------------------------------------------

// GET Admin login form
exports.admin_login_get = function(req, res, next) {
    res.render('admin/admin_login', {
        title: 'Admin Login',
        ohno: req.flash('ohno'),
        message: req.flash('message')
    })
}

// POST Admin login form
exports.admin_login_post = function(req, res, next) {
    Admins.findOne({
        'verify': req.body.verify
    }, function(err, sydney) {
        if (err) {
            return next(err);
        } else if (!sydney) {
            req.flash('ohno', 'Your verification_Id is incorrect')
            res.redirect('/admin/login');
        } else if (sydney.password != req.body.password) {
            req.flash('ohno', 'Your password is incorrect')
            res.redirect('/admin/login');
        } else {
            req.session.admin = sydney.id;
            req.flash('message', 'Welcome, You are the Admin of this website');
            res.redirect('/admin/hercules');
        }
    })
}

//--------------------------------------------------------------------------
// Display Author update form on GET.
exports.admin_update_get = function(req, res, next) {

    Admins.findById(req.session.admin)
        .exec(function(err, admin) {
            if (err) {
                return next(err);
            }
            if (admin == null) { // No results.
                var err = new Error('Admin not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('admin/admin_update', {
                title: 'Update Profile',
                admin: req.session.admin,
                admin_info: admin
            });

        });
};

exports.admin_update_post = function(req, res, next) {
    var judge = {
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        password: req.body.password
    };
    Admins.findByIdAndUpdate(req.params.id, judge, {
        new: true
    }, function(err, adminupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(adminupdate.url);
    });
}

//----------------------------------------------------------------------------------------

//GET Admin HOME Page
exports.admin = function(req, res, next) {
    async.parallel({
        didi: function(callback) {
            Admins.findOne({
                '_id': req.session.admin
            }).exec(callback);
        },
        newy: function(callback) {
            News.count().exec(callback);
        }
    }, function(err, name) {
        if (err) {
            return next(err);
        }
        res.render('admin/admin', {
            title: 'Admin Page',
            admin: req.session.admin,
            name: name.didi.surname,
            news: name.newy,
            message: req.flash('message')
        });
    })
}

// GET Profile page for a specific Admin.
exports.profiler = function(req, res, next) {
    Admins.findById(req.params.id)
        .exec(function(err, info) {
            if (err) {
                return next(err);
            } // Error in API usage.
            if (info == null) { // No results.
                console.log('There are no admin');
                var err = new Error('You are not an Admin');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('admin/admin_profile', {
                title: 'Admin Profile',
                layout: "less_layout",
                admin: req.session.admin,
                admin_info: info
            });
        })
};
//----------------------------------------------------------------------------------------------
// GET the names of every student in Tabular form
exports.list_students = function(req, res, next) {
    StudentSigns.find()
        .sort([
            ['level', 'ascending']
        ])
        .exec(
            function(err, swag) {
                if (err) {
                    return next(err);
                }
                res.render('admin/list_student', {
                    admin: req.session.admin,
                    title: "Complete List of Student",
                    slow: swag,
                    levy: "ALL PSYCHOLOGY STUDENTS",
                    message: req.flash('message')
                });
            }
        )
}



// GET Profile  of a student
exports.view_student_profile = function(req, res, next) {
    StudentSigns.findById(req.params.id)
        .exec(
            function(err, swag) {
                if (err) {
                    return next(err);
                }
                Courses.find({
                        'student_offering': req.params.id
                    })
                    .exec(function(err, mycourses) {
                        if (err) {
                            return next(err);
                        }
                        res.render('admin/view_student', {
                            admin: req.session.admin,
                            title: "Student Profile",
                            layout: "less_layout",
                            student: swag,
                            registered_courses: mycourses,
                            courserepno: function() {
                                if (swag.is_courserep == "No") {
                                    return swag.is_courserep;
                                } else {
                                    return;
                                }
                            },
                            photo: function() {
                                if (!swag.photo) {
                                    swag.photo = "../images/psylogo4.jpg";
                                    return swag.photo;
                                } else {
                                    return swag.photo;
                                }
                            }
                        });
                    });
            }
        )
}

// Make Course Rep.
exports.student_make_courserep = function(req, res, next) {
    var qualified = {
        is_courserep: req.body.courserep,
    };
    StudentSigns.findByIdAndUpdate(req.params.id, qualified, {}, function(err, studentupdate) {
        if (err) {
            return next(err);
        }
        res.redirect('/admin/studentprofile/' + studentupdate.id);
    });
};

exports.delete_student = function(req, res, next) {
    StudentSigns.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }
        req.flash('message', 'The student was successfully deleted');
        res.redirect('/admin/studentlist');
    });
}

//Functions for displaying students by their levels
exports.list_100_student = function(req, res, next) {
    StudentSigns.find({
        'level': 100
    }, function(err, student) {
        if (err) {
            return next(err);
        }
        if (student == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 100 Student",
            message: "These are the List of All 100 Level NAPS Students",
            slow: student,
            levy: "100 LEVEL STUDENTS"
        });
    })
}

exports.list_200_student = function(req, res, next) {
    StudentSigns.find({
        'level': 200
    }, function(err, student) {
        if (err) {
            return next(err);
        }
        if (student == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 200 Student",
            message: "These are the List of All 200 Level NAPS Students",
            slow: student,
            levy: "200 LEVEL STUDENTS"
        });
    })
}

exports.list_300_student = function(req, res, next) {
    StudentSigns.find({
        'level': 300
    }, function(err, student) {
        if (err) {
            return next(err);
        }
        if (student == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 300 Student",
            message: "These are the List of All 300 Level NAPS Students",
            slow: student,
            levy: "300 LEVEL STUDENTS"
        });
    })
}

exports.list_400_student = function(req, res, next) {
    StudentSigns.find({
        'level': 400
    }, function(err, student) {
        if (err) {
            return next(err);
        }
        if (student == null) {
            res.redirect('/hercules/gladiators/spartans/admin');
        }
        res.render('admin/list_student', {
            admin: req.session.admin,
            title: "Complete List of 400 Student",
            message: "These are the List of All 400 level NAPS Students",
            slow: student,
            levy: "400 LEVEL STUDENTS"
        });
    })
}

exports.edit_level_info = function(req, res, next) {
    res.render('admin/edit_level_info', {
        admin: req.session.admin,
        title: "EDIT LEVEL INFO",
    });
}

exports.edit_100level_info = function(req, res, next) {
    StudentSigns.find({
            'level': 100
        })
        .exec((err, student) => {
            if (err) {
                return next(err);
            }
            res.render('admin/edit_final_info', {
                admin: req.session.admin,
                title: "EDIT 100 LEVEL INFO",
                message: 'change 100 level',
                student: student,
            });
        })

}

exports.edit_200level_info = function(req, res, next) {
    StudentSigns.find({
            'level': 200
        })
        .exec((err, student) => {
            if (err) {
                return next(err);
            }
            res.render('admin/edit_final_info', {
                admin: req.session.admin,
                title: "EDIT 200 LEVEL INFO",
                message: 'change 200 level',
                student: student
            });
        })

}

exports.edit_300level_info = function(req, res, next) {
    StudentSigns.find({
            'level': 300
        })
        .exec((err, student) => {
            if (err) {
                return next(err);
            }
            res.render('admin/edit_final_info', {
                admin: req.session.admin,
                title: "EDIT 300 LEVEL INFO",
                message: 'change 300 level',
                student: student
            });
        })

}

exports.edit_400level_info = function(req, res, next) {
    StudentSigns.find({})
        .exec((err, student) => {
            if (err) {
                return next(err);
            }
            res.render('admin/edit_final_info', {
                admin: req.session.admin,
                title: "EDIT 400 LEVEL INFO",
                message: 'change 400 level',
                student: student
            });
        })

}

//..........................................................................................................
// function for getting the names of every staff
exports.list_staffs = function(req, res, next) {
    Staff.find()
        .exec(function(err, staffs) {
            if (err) {
                return next(err);
            }
            if (staffs == null) {
                res.redirect('/hercules/gladiators/spartans/admin');
            }
            res.render('admin/list_staff', {
                admin: req.session.admin,
                title: "Complete List of Staffs",
                slow: staffs,
                message: req.flash('message')
            });
        });
}

// GET Profile of a Particular Staff
exports.view_staff_profile = function(req, res, next) {
    async.parallel({
        coursey: function(callback) {
            Courses.find({
                'lecturer': req.params.id
            }).exec(callback);
        },
        staffy: function(callback) {
            Staff.findById(req.params.id).exec(callback);
        }
    }, function(err, staff) {
        if (err) {
            return next(err);
        }
        res.render('admin/view_staffs', {
            admin: req.session.admin,
            title: "Staff Profile",
            layout: "less_layout",
            staff: staff.staffy,
            coursess: staff.coursey,
            photo: function() {
                if (!staff.staffy.photo) {
                    staff.staffy.photo = "../images/psylogo4.jpg";
                    return staff.staffy.photo;
                } else {
                    return staff.staffy.photo;
                }
            }
        });
    });
}

exports.delete_staff = function(req, res, next) {
    Staff.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }
        req.flash('message', 'The staff was successfully deleted')
        res.redirect('/admin/stafflist');
    });
}

//---------------------------------------------------------------------------------------------

// GET Admin form for Project Upload
exports.get_upload_project = function(req, res, next) {
    res.render('admin/upload_project', {
        title: "Upload Project Topic",
        layout: "less_layout",
        admin: req.session.admin
    })
}

// POST Admin form for Project Upload
exports.post_upload_project = function(req, res, next) {
    var fullPath = "./project_topics/" + req.file.filename;
    var project = new Project({
        project: fullPath,
        topic: req.body.topic,
        description: req.body.description
    });
    project.save(function(err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.redirect('/admin/getprojecttopicss');
    });

}

// GET Admin PROJECT Topics
exports.get_project_topics = function(req, res, next) {
    Project.find({}, function(err, release) {
        if (err) {
            return next(err);
        }
        if (release == null) {
            res.send('There is no PROJECT Content');
        }
        res.render('admin/project_topics', {
            admin: req.session.admin,
            layout: "less_layout",
            title: 'Psychology Project Topics',
            projectss: release
        });
    })
}

exports.delete_project = function(req, res, next) {
    Project.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/admin/getprojecttopicss');
    });
}

//--------------------------------------------------------------------------------------------------
exports.register_timetable = (req, res) => {
    res.render('admin/reg_timetable', {
        title: 'SELECT THE LEVEL',
        admin: req.session.admin,
        message: req.flash('message')
    });
}

exports.register_timetable_post = (req, res, next) => {
    Courses.find({
            "level": req.body.level
        })
        .exec((err, course) => {
            if (err) {
                return next(err);
            }
            res.render('admin/add_timetable', {
                title: "Add Time Table",
                layout: "less_layout",
                admin: req.session.admin,
                course: course,
                level: req.body.level
            })
        });
}


// POST student time table for a particular level
exports.post_time_table = (req, res, next) => {
    var timetable = new Timetable({
        level: req.body.level,
        day: req.body.day,
        time: req.body.time,
        course: req.body.course
    });
    timetable.save((err) => {
        if (err) {
            return next(err);
        }
        req.flash('message', `The Course was successfully uploaded`);
        res.redirect('/admin/regtimetable');
    });

}

//----------------------------------------------------------------------------
// GET Admin form for Posting NEWS
exports.get_upload_news = function(req, res, next) {
    res.render('admin/admin_get_news', {
        title: 'Admin Upload Projects',
        layout: "less_layout",
        admin: req.session.admin
    });
}

// POST Admin form for NEWS 
exports.post_upload_news = function(req, res, next) {
    var fullPath = "./newsproject/" + req.file.filename;
    var latest = new News({
        picture: fullPath,
        heading: req.body.heading,
        passage: req.body.passage,
        passage1: req.body.passage1,
        passage2: req.body.passage2
    });
    latest.save(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/admin/getlastnews');
    });
}

exports.news_edit_get = function(req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function(err, newy) {
        if (err) {
            return next(err);
        }
        res.render('admin/edit_news', {
            admin: req.session.admin,
            layout: "less_layout",
            title: 'EDIT NEWS',
            newy: newy
        });
    })

}

exports.news_edit_post = function(req, res, next) {
    var latest = {
        heading: req.body.heading,
        passage: req.body.passage,
        passage1: req.body.passage1,
        passage2: req.body.passage2
    };
    News.findByIdAndUpdate(req.params.id, latest, {}, function(err, newsupdate) {
        if (err) {
            return next(err);
        }
        req.flash('message', 'This news was successfully edited');
        res.redirect(newsupdate.adminurl);
    });
}

// GET Admin latest NEWS
exports.get_last_news = function(req, res, next) {
    News.find({}).sort([
        ['created', 'ascending']
    ]).exec(function(err, news) {
        if (err) {
            return next(err);
        }
        if (news == null) {
            res.send('There is no NEWS Content');
        }
        res.render('admin/admin_news', {
            admin: req.session.admin,
            title: 'Psychology News',
            layout: "less_layout",
            newspaper: news
        });
    })
}

// GET Admin full NEWS
exports.get_full_news = function(req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function(err, news) {
        if (err) {
            return next(err);
        }
        res.render('admin/fullnews', {
            admin: req.session.admin,
            layout: "less_layout",
            title: 'Psychology Full News',
            newspaper: news,
            comments: news.comments,
            message: req.flash('message')
        });
    })
}

//Post comments
exports.post_comment_news = function(req, res, next) {
    Admins.findById(req.session.admin)
        .exec(function(err, namey) {
            var commerce = {
                user: "Admin: " + namey.firstname,
                comment: req.body.comment
            }
            if (err) {
                return next(err);
            }
            News.findByIdAndUpdate(req.params.id, {
                $push: {
                    comments: commerce
                }
            }, function(err, commet) {
                if (err) {
                    return next(err);
                }
                res.redirect('/admin/getfullnews/' + commet.id);
            });

        });
}

exports.delete_news = function(req, res, next) {
    News.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/admin/getlastnews');
    });
}

//----------------------------------------------------------------------



//------------------------------------------------------------------------------------
// ADMIN GET course registration
exports.add_courses = function(req, res, next) {
    Staff.find({}, function(err, teacher) {
        if (err) {
            return next(err);
        }
        res.render('admin/add_courses', {
            title: 'Add Courses',
            layout: "less_layout",
            admin: req.session.admin,
            teacher: teacher
        });
    })

}

//ADMIN POST Course Registration
exports.post_course = function(req, res, next) {
    var course = new Courses({
        coursecode: req.body.coursecode,
        coursetitle: req.body.coursetitle,
        level: req.body.level,
        semester: req.body.semester,
        units: req.body.units,
        borrowed: req.body.borrowed,
        courseoutline: req.body.courseoutline
    });
    course.save(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect(course.url);
    });
}


// GET course form for update.
exports.course_update_get = function(req, res, next) {
    async.parallel({
        coursess: function(callback) {
            Courses.findById(req.params.id)
                .exec(callback);
        }

    }, function(err, coursey) {
        if (err) {
            return next(err);
        }
        if (coursey.coursess == null) { // No results.
            var err = new Error('Course not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('admin/edit_course', {
            title: 'Update Course_Outline',
            layout: "less_layout",
            admin: req.session.admin,
            coursey: coursey.coursess
        });
    });
};

//POST course form for update
exports.course_update_post = function(req, res, next) {
    var course = {
        coursecode: req.body.coursecode,
        coursetitle: req.body.coursetitle,
        level: req.body.level,
        semester: req.body.semester,
        units: req.body.units,
        borrowed: req.body.borrowed,
        courseoutline: req.body.courseoutline,
        _id: req.params.id
    };
    Courses.findByIdAndUpdate(req.params.id, course, {}, function(err, courseupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(courseupdate.url);
    });
}

exports.delete_course = function(req, res, next) {
    Courses.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/admin/getallcourses');
    });
}


//---------------------------------------------------------------------------------------------------------------------------
// GET List of 100Level Courses...
exports.get_100_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function(err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('admin/list_courses', {
            title: "100 Level Courses",
            layout: "less_layout",
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
exports.get_200_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function(err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/getallcourses');
        }
        res.render('admin/list_courses', {
            title: "200 Level Courses",
            layout: "less_layout",
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
exports.get_300_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function(err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('admin/list_courses', {
            title: "300 Level Courses",
            layout: "less_layout",
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
exports.get_400_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, function(err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('admin/list_courses', {
            title: "400 Level Courses",
            layout: "less_layout",
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
exports.view_course = function(req, res, next) {
    Courses.findById(req.params.id)
        .exec(function(err, course) {
            if (err) {
                return next(err);
            }
            Staff.find({})
                .exec(function(err, staff) {

                    if (err) {
                        return next(err);
                    }

                    res.render('admin/view_course', {
                        title: 'Psychology Course',
                        layout: "less_layout",
                        admin: req.session.admin,
                        kind: course,
                        teacher: staff,
                        message: req.flash('delete'),
                        lecky: () => {
                            var sorted_lecturer = [];
                            var course_lecturer = course.lecturer;
                            var staffy = staff;
                            course_lecturer.forEach(element => {
                                sorted_lecturer.push(element);
                            });
                            var marvel = staffy.filter(function(lecturer) {
                                for (var i = 0; i < sorted_lecturer.length; i++) {
                                    if (sorted_lecturer[i] == lecturer.id) {
                                        return lecturer;
                                    }
                                }
                            });
                            return marvel;
                        }
                    });
                });
        });
}

exports.edit_course_lecturer = function(req, res, next) {
    var staffy = req.body.lecturee;
    Courses.findByIdAndUpdate(req.params.id, {
        $addToSet: {
            lecturer: staffy
        }
    }, function(err) {
        if (err) {
            return next(err);
        }
        req.flash('delete', "The Lecturer was successfully added");
        res.redirect('/admin/viewcourse/' + req.params.id);
    });


}

exports.delete_course_lecturer = function(req, res, next) {
    Courses.findOneAndUpdate({
            '_id': req.params.id
        }, {
            $pull: {
                'lecturer': req.body.lect
            }
        },
        function(err) {
            if (err) {
                return next(err);
            }
            req.flash('delete', "The lecturer was successfully deleted");
            res.redirect('/admin/viewcourse/' + req.params.id);
        });
}

// GET List of students offering a course...
exports.student_coursesoffered = function(req, res, next) {
    Courses.findOne({
        '_id': req.params.id
    }).exec((err, course) => {
        if (err) {
            return next(err);
        }
        StudentSigns.find({})
            .exec((err, students) => {
                if (err) {
                    return next(err);
                }
                res.render('admin/view_select', {
                    title: "Student_Registered",
                    admin: req.session.admin,
                    courses: course,
                    upload: function() {
                        var sorted_registered = [];
                        var chosen = [];
                        var registered = course.student_offering;
                        var deal = students;
                        registered.forEach(element => {
                            sorted_registered.push(element);
                        });
                        deal.filter((hero) => {
                            for (var i = 0; i < sorted_registered.length; i++) {
                                if (sorted_registered[i] == hero.id) {
                                    chosen.push(hero);
                                }
                            }
                        });
                        return chosen;
                    }
                });
            });
    });
}


// GET Student Result Filler form
exports.student_addresult_get = function(req, res, next) {
    Courses.findOne({
        '_id': req.params.id
    }).exec(function(err, course) {
        if (err) {
            return next(err);
        }
        StudentSigns.find({
            '_id': course.student_offering
        }).exec(function(err, students) {
            if (err) {
                return next(err);
            }
            Result.find({
                'course': course.id,
                'student': course.student_offering
            }).exec(function(err, results) {
                if (err) {
                    return next(err);
                }
                res.render('admin/student_result_form', {
                    title: "Add Student Result",
                    layout: "less_layout",
                    admin: req.session.admin,
                    courses: course,
                    upload: students,
                    results: results,
                    message: req.flash('message'),
                    accept: function() {
                        var filled = [];
                        var result = results;
                        var student = students;
                        student.forEach(element => {
                            result.filter(function(resul) {
                                if (element.id == resul.student) {
                                    console.log(resul.id);
                                    var jesus = {
                                        name: `${element.surname} ${element.firstname}`,
                                        matnumber: element.matnumber,
                                        grade: resul.grade,
                                        result_id: resul.id
                                    }
                                    filled.push(jesus);
                                }

                            });
                        });

                        return filled;
                    }
                });
            });
        });
    });
}


exports.student_addresults_post = function(req, res, next) {
    var resulty = new Result({
        course: req.body.course,
        student: req.body.student,
        score: req.body.score,
        grade: req.body.grade
    });
    resulty.save(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('message', "The result was successfully saved");
        res.redirect('/admin/studentaddresult/' + req.params.id);
    })


}

exports.view_all_results = function(req, res, next) {
    Result.find({})
        .exec(function(err, result) {
            if (err) {
                return next(err);
            }
            res.render('admin/view_all_results', {
                title: 'ALL STUDENTS RESULTS',
                admin: req.session.admin,
                result: result
            });
        })
}

//function for deleting a single student result from the list of students offering a course
exports.delete_result = function(req, res, next) {
    Result.findByIdAndRemove({
        '_id': req.params.id
    }).
    exec(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('message', "A student's result was deleted from this list")
        res.redirect('/admin/studentaddresult/' + req.body.code);
    })
}

//View Student Result
exports.student_result = function(req, res, next) {
    StudentSigns.findById(req.params.id)
        .exec(function(err, myresults) {
            if (err) {
                return next(err);
            }
            res.render('admin/view_result', {
                title: 'Student Result',
                layout: "less_layout",
                admin: req.session.admin,
                allresult: myresults.results,
                oneresult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 100 && hero.semester == 1;
                        })
                        return marvel;
                    }
                },
                onetworesult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 100 && hero.semester == 2;
                        })
                        return marvel;
                    }
                },
                tworesult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 200 && hero.semester == 1;
                        })
                        return marvel;
                    }
                },
                twotworesult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 200 && hero.semester == 2;
                        })
                        return marvel;
                    }
                },
                threeresult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 300 && hero.semester == 1;
                        })
                        return marvel;
                    }
                },
                threetworesult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 300 && hero.semester == 2;
                        })
                        return marvel;
                    }
                },
                fourresult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 400 && hero.semester == 1;
                        })
                        return marvel;
                    }
                },
                fourtworesult: function() {
                    if (myresults.results) {
                        var heroes = myresults.results;
                        var marvel = heroes.filter(function(hero) {
                            return hero.level == 400 && hero.semester == 2;
                        })
                        return marvel;
                    }
                }

            });
        });
}

exports.student_delete_result = function(req, res, next) {
    StudentSigns.findByIdAndUpdate(req.params.id, {
        $pull: {
            results: {
                "_id": req.params.id
            }
        }
    }, function(error, success) {
        if (error) {
            return next(error)
        }
        res.redirect('/admin/studentfullresults/' + success.id)
    })
}

// staff signup GET
exports.staff_signup_get = function(req, res, next) {
    res.render('admin/staff_signup', {
        title: 'STAFF SIGNUP',
        layout: "less_layout",
        admin: req.session.admin
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
            res.render('sadmin/staff_signup', {
                title: 'Create Staff',
                staff: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.
            // Create a Staff object with escaped and trimmed data.
            var staff_register = new Staff({
                email: req.body.email,
                surname: req.body.surname,
                firstname: req.body.firstname,
                staff_id: req.body.staff_id,
                gender: req.body.gender,
                phone: req.body.phone,
                bio: req.body.bio,
                password: req.body.password
            });
            staff_register.save(function(err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to Staff login page.
                res.redirect(staff_register.urly);
            });
        }
    }
];

//ADMIN Logout Request
exports.admin_logout = (req, res) => {
    if (req.session.admin) {
        req.session.destroy();
    }
    res.redirect('/');
}