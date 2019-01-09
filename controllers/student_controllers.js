// this is the controller for handling anything student 


var StudentSigns = require('../models/studentSchema');
var Staff = require('../models/staffSchema');
var News = require('../models/newsSchema');
var Project = require('../models/projectSchema');
var Courses = require('../models/coursesSchema');
const Result = require('../models/resultSchema');
var Timetable = require('../models/timetableSchema');
var async = require('async');
var path = require('path');


const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');


//---------------------------------------------------------------------------------
exports.loginRequired = (req, res, next) => {
    if (!req.session.student) {
        res.redirect('login');
    } else {
        next();
    }
}

// this function ensures that another user does not tamper with a user's account
exports.ensureCorrectuser = (req, res, next) => {
    if (req.session.student !== req.params.id) {
        res.redirect('login');
    } else {
        next();
    }
}

//----------------------------------------------------------------------------

// GET the Student signup form
exports.student_signup_get = (req, res, next) => {
    res.render('homefile/student_signup', {
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
            var fullPath = "files/" + req.file.filename;
            // Create an Student object with escaped and trimmed data.
            var qualified = new StudentSigns({
                email: req.body.email,
                surname: req.body.surname,
                firstname: req.body.firstname,
                matnumber: req.body.matnumber,
                level: req.body.level,
                gender: req.body.gender,
                phone: req.body.phone,
                photo: fullPath,
                bio: req.body.bio,
                password: req.body.password
            });
            qualified.save((err) => {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to login page.
                req.flash('message', "You've been Registered, Please login")
                res.redirect('/login');
            });
        }
    }
];


//----------------------------------------------------------------------
// function for Student Login GET
exports.get_login_form = (req, res) => {
    res.render('homefile/login', {
        title: 'Student Login',
        ohno: req.flash('ohno'),
        message: req.flash('message')
    });
}

// function for Student Login POST
exports.test_login = (req, res, next) => {
    StudentSigns.findOne({
        'matnumber': req.body.matnumber
    }, (err, user) => {
        if (err) {
            return next(err);
        } else if (!user) {
            req.flash('ohno', "Mat. Number not found");
            res.redirect(302, '/login');
        } else if (user.password !== req.body.password) {
            //password is incorrect
            req.flash('ohno', "Prince, Password is Incorrect")
            res.redirect(302, '/login');
        } else if (user && user.password == req.body.password) {
            req.session.student = {
                id: user.id,
                level: user.level,
                matnumber: user.matnumber,
                firstname: user.firstname,
                surname: user.surname
            }
            req.flash('message', `Welcome ${user.surname}`);
            res.redirect('/studenthome');
        } else {
            res.redirect('/login');
        }
    });

};

exports.get_student_home = (req, res, next) => {

    async.parallel({
        didi: (callback) => {
            StudentSigns.findOne({
                '_id': req.session.student.id
            }).exec(callback);
        },
        newy: (callback) => {
            News.count().exec(callback);
        }
    }, (err, name) => {
        if (err) {
            return next(err);
        }
        res.render('student/student_home', {
            title: 'Student HomePage',
            allowed: req.session.student,
            person: name.didi,
            courserep: () => {
                if (name.didi.is_courserep == "Yes") {
                    return name.didi.is_courserep;
                }
            },
            news: name.newy,
            message: req.flash('message')
        });
    })
};

// Profile page for a specific Student.
exports.profiler = (req, res, next) => {
    StudentSigns.findById(req.session.student.id)
        .exec((err, user) => {
            if (err) {
                return next(err);
            } // Error in API usage.
            if (user == null) { // No results.
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            }
            Courses.find({
                    'student_offering': req.session.student.id
                })
                .exec(function(err, mycourses) {
                    if (err) {
                        return next(err);
                    }
                    // Successful, so render.
                    res.render('student/profiler', {
                        allowed: req.session.student,
                        title: 'Student Profile',
                        user: user,
                        registered_courses: mycourses
                    });
                });
        });
};

// Display Student update form on GET.
exports.student_update_get = (req, res, next) => {
    StudentSigns.findById(req.session.student.id)
        .exec((err, coursey) => {
            if (err) {
                return next(err);
            }
            if (coursey == null) { // No results.
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('student/edit_profile', {
                title: 'Update Profile',
                allowed: req.session.student,
                coursey: coursey
            });

        });
};

exports.student_update_post = (req, res, next) => {
    var qualified = {
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        phone: req.body.phone,
        bio: req.body.bio,
        password: req.body.password,
    };
    StudentSigns.findByIdAndUpdate(req.params.id, qualified, {}, (err, studentupdate) => {
        if (err) {
            return next(err);
        }
        res.redirect(studentupdate.url);
    });
}

exports.student_update_pics = (req, res, next) => {
    var fullPath = "files/" + req.file.filename;
    var qualified = {
        photo: fullPath,
        _id: req.params.id
    };
    StudentSigns.findByIdAndUpdate(req.session.student.id, qualified, {}, (err, studentupdate) => {
        if (err) {
            return next(err);
        }
        res.redirect(studentupdate.url);
    });
}

// GET Profile  of a student
exports.view_coursemate_profile = (req, res, next) => {
    StudentSigns.findById(req.params.id)
        .exec(
            (err, coursemate) => {
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
                        res.render('student/views_student', {
                            allowed: req.session.student,
                            title: "CourseMate Profile",
                            coursemate: coursemate,
                            registered_courses: mycourses,
                            photo: () => {
                                if (!coursemate.photo) {
                                    coursemate.photo = "../images/psylogo4.jpg";
                                    return coursemate.photo;
                                } else {
                                    return coursemate.photo;
                                }
                            }
                        });
                    });
            }
        )
}


//Functions for displaying just your coursemates
exports.list_coursemates = (req, res, next) => {
    StudentSigns.find({
            'level': req.session.student.level
        })
        .exec(
            (err, coursemate) => {
                if (err) {
                    return next(err);
                }
                res.render('student/lists_students', {
                    allowed: req.session.student,
                    title: "Complete List of your Course Mates",
                    slow: coursemate,
                    head: "COURSEMATES"
                });
            }
        )
}

//Functions for displaying just your coursemates
exports.list_psychology_students = (req, res, next) => {
    StudentSigns.find({})
        .exec((err, students) => {
            if (err) {
                return next(err);
            }
            res.render('student/lists_students', {
                allowed: req.session.student,
                title: "ALL PSYCHOLOGY STUDENTS",
                slow: students,
                head: "ALL PSYCHOLOGY STUDENTS"
            });
        });
}

//Functions for displaying just your coursemates
exports.list_100mates = (req, res, next) => {
    StudentSigns.find({
        'level': 100
    }, (err, students) => {
        if (err) {
            return next(err);
        }
        res.render('student/lists_students', {
            allowed: req.session.student,
            title: "100 LEVEL STUDENTS",
            slow: students,
            head: "100 LEVEL PSYCHOLOGY STUDENTS"
        });
    });
}

//Functions for displaying just your coursemates
exports.list_200mates = (req, res, next) => {
    StudentSigns.find({
        'level': 200
    }, (err, students) => {
        if (err) {
            return next(err);
        }
        res.render('student/lists_students', {
            allowed: req.session.student,
            title: "200 LEVEL STUDENTS",
            slow: students,
            head: "200 LEVEL PSYCHOLOGY STUDENTS"
        });
    });
}

//Functions for displaying just your coursemates
exports.list_300mates = (req, res, next) => {
    StudentSigns.find({
        'level': 300
    }, (err, students) => {
        if (err) {
            return next(err);
        }
        res.render('student/lists_students', {
            allowed: req.session.student,
            title: "300 LEVEL STUDENTS",
            slow: students,
            head: "300 LEVEL PSYCHOLOGY STUDENTS"
        });
    })

}

//Functions for displaying just your coursemates
exports.list_400mates = (req, res, next) => {
    StudentSigns.find({
        'level': 400
    }, (err, students) => {
        if (err) {
            return next(err);
        }
        res.render('student/lists_students', {
            allowed: req.session.student,
            title: "400 LEVEL STUDENTS",
            slow: students,
            head: "400 LEVEL PSYCHOLOGY STUDENTS"
        });
    });
}


// function for getting the names of every staff
exports.list_staffs = (req, res, next) => {
    Staff.find({})
        .exec((err, staffs) => {
            if (err) {
                return next(err);
            }
            res.render('student/list_staff', {
                allowed: req.session.student,
                title: "Complete List of Staffs",
                slow: staffs
            });
        });
}

// GET Profile of a Particular Staff
exports.view_staff_profile = (req, res, next) => {
    async.parallel({
        coursey: (callback) => {
            Courses.find({
                'lecturer': req.params.id
            }).exec(callback);
        },
        staffy: (callback) => {
            Staff.findById(req.params.id).exec(callback);
        }
    }, (err, staffs) => {
        if (err) {
            return next(err);
        }
        res.render('student/view_staff', {
            allowed: req.session.student,
            title: "Staff Profile",
            staffs: staffs.staffy,
            coursess: staffs.coursey,
            photo: () => {
                if (!staffs.staffy.photo) {
                    staffs.staffy.photo = "../images/psylogo4.jpg";
                    return staffs.staffy.photo;
                } else {
                    return staffs.staffy.photo;
                }
            }
        });
    });
}

// GET Student latest NEWS
exports.get_last_news = (req, res, next) => {
    News.find({}).sort([
        ['created', 'ascending']
    ]).exec((err, news) => {
        if (err) {
            return next(err);
        }
        res.render('student/student_read_news', {
            allowed: req.session.student,
            title: 'Psychology News',
            newspaper: news
        });
    })
}

// GET Student full NEWS
exports.get_full_news = (req, res, next) => {
    News.findOne({
        '_id': req.params.id
    }, (err, news) => {
        if (err) {
            return next(err);
        }
        res.render('student/fullnews', {
            allowed: req.session.student,
            title: 'Psychology Full News',
            newspaper: news,
            comments: news.comments,
            reply: req.flash('reply')
        });
    });
}

//Post comments
exports.post_comment_news = (req, res, next) => {
    console.log(req.body, 'request');
    user = req.session.student;
    var commentor = {
        user: user.firstname,
        comment: req.body.comment
    }
    News.findByIdAndUpdate(req.params.id, {
        $push: {
            comments: commentor
        }
    }, (err, comment) => {
        if (err) {
            return next(err);;
        }
        req.io.emit("chat_message", req.body.comment);
        res.json({
            status: 200,
            data: comment
        });

    });
}


//Post reply comments
exports.post_reply_comment = (req, res, next) => {
    async.parallel({
        news: (callback) => {
            News.findOne({
                    "comments._id": req.params.id
                })
                .exec(callback);
        },
    }, function(err, paper) {
        if (err) {
            return next(err);
        }
        var ones = req.params.id;
        var replyer = {
            user: req.session.student.firstname,
            commentor: req.body.commentor,
            comment: req.body.commenta
        }
        News.findOneAndUpdate({
            '_id': paper.news.id,
            'comments._id': ones
        }, {
            $push: {
                "comments.$.reply": replyer

            },
        }, function(err) {
            if (err) {
                return next(err);
            }
            req.flash('reply', 'Nice Comment!')
            res.redirect('/studentgetfullnews/' + paper.news.id);
        });
    });
}

//Post Like News
exports.post_news_like = (req, res, next) => {

    News.findOne({
            '_id': req.params.id
        })
        .exec(function(err, news) {
            if (err) {
                return next(err)
            }

            News.findOneAndUpdate({
                '_id': news.id
            }, {
                $inc: {
                    'likes': 1
                }
            }, function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/studentgetlastnews/');
            });



        });
}

//Post Like News
exports.post_news_dislike = (req, res, next) => {

    News.findOne({
            '_id': req.params.id
        })
        .exec(function(err, news) {
            if (err) {
                return next(err)
            }

            News.findOneAndUpdate({
                '_id': news.id
            }, {
                $inc: {
                    'dislikes': 1
                }
            }, function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/studentgetlastnews/');
            });



        });
}

//Post Like comments
exports.post_like_comment = (req, res, next) => {

    News.findOne({
            "comments._id": req.params.id
        })
        .exec(function(err, ion) {
            if (err) {
                return next(err)
            }

            News.findOneAndUpdate({
                '_id': ion.id,
                'comments._id': req.params.id
            }, {
                $inc: {
                    'comments.$.like': 1
                }
            }, function(err, commet) {
                if (err) {
                    return next(err);
                }
                res.redirect('/studentgetfullnews/' + commet.id);
            });



        });
}

//Post Like comments
exports.post_dislike_comment = (req, res, next) => {

    News.findOne({
            "comments._id": req.params.id
        })
        .exec(function(err, ion) {
            if (err) {
                return next(err)
            }

            News.findOneAndUpdate({
                '_id': ion.id,
                'comments._id': req.params.id
            }, {
                $inc: {
                    'comments.$.dislike': 1
                }
            }, function(err, commet) {
                if (err) {
                    return next(err);
                }
                res.redirect('/studentgetfullnews/' + commet.id);
            });



        });
}

// GET List of 100Level Courses...
exports.get_100_courses = (req, res, next) => {
    async.parallel({
        first_semester: (callback) => {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: (callback) => {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: (callback) => {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: (callback) => {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, (err, hundred) => {
        if (err) {
            return next(err);
        }
        res.render('student/list_courses', {
            title: "100 Level Courses",
            allowed: req.session.student,
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
exports.get_200_courses = (req, res, next) => {
    async.parallel({
        first_semester: (callback) => {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: (callback) => {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: (callback) => {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: (callback) => {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, (err, hundred) => {
        if (err) {
            return next(err);
        }
        res.render('student/list_courses', {
            title: "200 Level Courses",
            allowed: req.session.student,
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
exports.get_300_courses = (req, res, next) => {
    async.parallel({
        first_semester: (callback) => {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: (callback) => {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: (callback) => {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: (callback) => {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, (err, hundred) => {
        if (err) {
            return next(err);
        }
        res.render('student/list_courses', {
            title: "300 Level Courses",
            allowed: req.session.student,
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
exports.get_400_courses = (req, res, next) => {
    async.parallel({
        first_semester: (callback) => {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback);
        },
        first_semester_borrowed: (callback) => {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback);
        },
        second_semester: (callback) => {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback);
        },
        second_semester_borrowed: (callback) => {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback);
        },
    }, (err, hundred) => {
        if (err) {
            return next(err);
        }
        res.render('student/list_courses', {
            title: "400 Level Courses",
            allowed: req.session.student,
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
exports.view_courses = (req, res, next) => {
    Courses.findById(req.params.id)
        .exec((err, course) => {
            if (err) {
                return next(err);
            }
            Staff.find({})
                .exec(function(err, staff) {
                    if (err) {
                        return next(err);
                    }
                    res.render('student/view_courses', {
                        title: 'Psychology Course',
                        allowed: req.session.student,
                        kind: course,
                        teacher: staff,
                        succeed: req.flash('succeed'),
                        war: req.flash('war'),
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

// GET List of students offering a course...
exports.student_course_registered = (req, res, next) => {
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
                if (req.session.student.level >= course.level) {
                    res.render('student/view_select', {
                        title: "Student_Registered",
                        allowed: req.session.student,
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
                } else {
                    req.flash('succ', 'You can not view this course');
                    res.redirect('/studentviewcourse/' + req.params.id);
                }
            });
    });
}

// student course registrations
exports.register_course = (req, res, next) => {
    var student = req.session.student;
    Courses.findById(req.params.id)
        .exec((err, course) => {
            if (err) {
                return next(err);
            }
            if (student.level == course.level) {
                var de = {
                    $addToSet: {
                        student_offering: student.id
                    }
                };
                Courses.findOneAndUpdate({
                        "_id": req.params.id
                    }, de, {},
                    function(err) {
                        if (err) {
                            return next(err);
                        }
                        req.flash('succeed', 'Your Course registration was Successful');
                        res.redirect('/studentviewcourse/' + req.params.id);

                    });
            } else if (student.level != course.level) {

                req.flash('war', 'Your level is not eligible to register for this course');
                res.redirect('/studentviewcourse/' + req.params.id);
            } else {
                return;
            }
        });
}


// GET Student PROJECT Topics
exports.get_project_topics = (req, res, next) => {
    Project.find({})
        .exec((err, release) => {
            if (err) {
                return next(err);
            }
            res.render('student/project_topics', {
                allowed: req.session.student,
                title: 'Psychology Project Topics',
                projectss: release
            });
        })
}



//GET already set time table for all student in a level
exports.get_time_table = (req, res, next) => {
    var student = req.session.student;
    Timetable.find({
            "level": student.level
        })
        .exec((err, times) => {
            if (err) {
                return next(err);
            }
            res.render('student/time_table', {
                title: "Student's TimeTable",
                allowed: req.session.student,
                studenty: () => {
                    if (student.is_courserep == "Yes") {
                        return student.is_courserep;
                    } else {
                        return;
                    }
                },
                time: () => {
                    if (times) {
                        var heroes = times;
                        var marvel = heroes.filter((hero) => {
                            return hero.time == 8;
                        })
                        console.log(marvel);
                        return marvel;
                    }
                },
                time2: () => {
                    if (times) {
                        var heroes = times;
                        var marvel = heroes.filter((hero) => {
                            return hero.time == 10;
                        })
                        return marvel;
                    }
                },
                time3: () => {
                    if (times) {
                        var heroes = times;
                        var marvel = heroes.filter((hero) => {
                            return hero.time == 12;
                        })
                        return marvel;
                    }
                },
                time4: () => {
                    if (times) {
                        var heroes = times;
                        var marvel = heroes.filter((hero) => {
                            return hero.time == 2;
                        })
                        return marvel;
                    }
                }
            })
        });
}

// GET time table form for course reps only
exports.add_time_table = (req, res, next) => {
    StudentSigns.findOne({
            "_id": req.session.student
        })
        .exec((err, student) => {
            if (err) {
                return next(err);
            }
            if (student.is_courserep == "Yes") {
                Courses.find({
                        "level": student.level
                    })
                    .exec((err, course) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('student/add_timetable', {
                            title: "Add Time Table",
                            allowed: req.session.student,
                            timetable: student,
                            course: course
                        })
                    })
            } else {
                res.redirect('/studenthome');
            }
        })

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
        res.redirect('/gettimetable');
    });

}

//Edit the time table by the course rep only
exports.edit_timetable = (req, res, next) => {
    Timetable.findOne({
            '_id': req.params.id
        })
        .exec((err, timey) => {
            if (err) {
                return next(err);
            }
            Courses.find({
                    "level": timey.level
                })
                .exec((err, course) => {
                    if (err) {
                        return next(err);
                    }
                    res.render('student/edit_timetable', {
                        title: 'Edit Time Table',
                        allowed: req.session.student,
                        timey: timey,
                        course: course
                    });
                })
        });
}

//Post Edit the time table
exports.edit_post_timetable = (req, res, next) => {
    var timetable = {
        course: req.body.course
    }
    Timetable.findOneAndUpdate(req.params.id, timetable, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/gettimetable');
    })
}

// function for checking students results
exports.student_result = (req, res, next) => {
    Result.find({
            'student': req.session.student.id
        })
        .exec((err, myresults) => {
            if (err) {
                return next(err);
            }
            Courses.find({})
                .exec((err, coursess) => {
                    if (err) {
                        return next(err);
                    }
                    res.render('student/student_result', {
                        title: 'Personal Result',
                        allowed: req.session.student,
                        oneresult: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 100 && single_course.semester == 1) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                        oneresult2: function() {
                            var real = [];
                            var resulty = myresults;
                            var coursey = coursess;
                            resulty.forEach(read => {
                                coursey.filter(function(single_course) {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 100 && single_course.semester == 2) {
                                            var follow = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            real.push(follow);
                                        }
                                    }
                                });
                            });
                            return real;
                        },
                        tworesult: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 200 && single_course.semester == 1) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                        tworesult2: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 100 && single_course.semester == 2) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                        threeresult: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 300 && single_course.semester == 1) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                        threeresult2: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 300 && single_course.semester == 2) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                        fourresult: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 400 && single_course.semester == 1) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                        fourresult2: () => {
                            var sorted_result = [];
                            var result = myresults;
                            var course = coursess;
                            result.forEach(read => {
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 400 && single_course.semester == 2) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert);
                                        }
                                    }
                                });
                            });
                            return sorted_result;
                        },
                    });
                });
        });
}

// NAPS Group Chat function
exports.chat = (req, res, next) => {
    StudentSigns.findOne({
        '_id': req.session.student
    }, function(err, senior) {
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

// to Log-Out Students from the site
exports.logout = (req, res) => {
    if (req.session.student) {
        req.session.destroy();
    }
    res.redirect('/');
}