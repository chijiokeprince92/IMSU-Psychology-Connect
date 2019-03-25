// this is the controller for handling anything student

var StudentSigns = require('../models/studentSchema')
var Staff = require('../models/staffSchema')
var News = require('../models/newsSchema')
var Project = require('../models/projectSchema')
var Courses = require('../models/coursesSchema')
var Result = require('../models/resultSchema')
var Timetable = require('../models/timetableSchema')
var async = require('async')


var { body, validationResult } = require('express-validator/check')
var { sanitizeBody } = require('express-validator/filter')

// ---------------------------------------------------------------------------------
exports.loginRequired = (req, res, next) => {
    if (!req.session.student) {
        res.redirect('/login')
    } else {
        next()
    }
}

// this function ensures that another user does not tamper with a user's account
exports.ensureCorrectuser = (req, res, next) => {
    if (req.session.student !== req.params.id) {
        res.redirect('/login')
    } else {
        next()
    }
}

// ----------------------------------------------------------------------------

// GET the Student signup form
exports.student_signup_get = (req, res, next) => {
    res.render('homefile/student_signup', {
        title: 'student_signup',
        layout: 'less_layout'
    })
}

// handle POST request for the Student signup form
exports.student_signup_post = [
    body('email')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('email must be specified.'),
    body('surname')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('Surname must be specified.'),
    body('firstname')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('firstname must be specified.'),
    body('matnumber')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('matnumber must be specified.'),
    body('level')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('level must be specified.'),
    body('gender')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('gender must be specified.'),
    body('phone')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('phone must be specified.'),
    body('password')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('password must be specified.'),

    // Sanitize the fields
    sanitizeBody('email')
    .trim()
    .escape(),
    sanitizeBody('surname')
    .trim()
    .escape(),
    sanitizeBody('firstname')
    .trim()
    .escape(),
    sanitizeBody('matnumber')
    .trim()
    .escape(),
    sanitizeBody('level')
    .trim()
    .escape(),
    sanitizeBody('gender')
    .trim()
    .escape(),
    sanitizeBody('phone')
    .trim()
    .escape(),
    sanitizeBody('password')
    .trim()
    .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('student/student_signup', {
                title: 'Create Student',
                student: req.body,
                errors: errors.array()
            })
        } else {
            // Data from form is valid.
            var fullPath = 'files/' + req.file.filename
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
            })
            qualified.save(err => {
                if (err) {
                    return next(err)
                }
                // Successful - redirect to login page.
                req.flash('message', "You've been Registered, Please login")
                res.redirect('/login')
            })
        }
    }
]

// ----------------------------------------------------------------------
// function for Student Login GET
exports.get_login_form = (req, res) => {
    res.render('homefile/login', {
        title: 'Student Login',
        ohno: req.flash('ohno'),
        message: req.flash('message')
    })
}

// function for Student Login POST
exports.test_login = (req, res, next) => {
    StudentSigns.findOne({
            matnumber: req.body.matnumber
        },
        (err, user) => {
            if (err) {
                return next(err)
            } else if (!user) {
                req.flash('ohno', 'Mat. Number not found')
                res.redirect(302, '/login')
            } else if (user.password !== req.body.password) {
                // password is incorrect
                req.flash('ohno', 'Prince, Password is Incorrect')
                res.redirect(302, '/login')
            } else if (user && user.password === req.body.password) {
                req.session.student = {
                    id: user.id,
                    level: user.level,
                    matnumber: user.matnumber,
                    firstname: user.firstname,
                    surname: user.surname
                }
                req.flash('message', `Welcome ${user.surname}`)
                res.redirect('/studenthome')
            } else {
                res.redirect('/login')
            }
        }
    )
}

exports.get_student_home = (req, res, next) => {
    async.parallel({
            user: callback => {
                StudentSigns.findOne({
                    _id: req.session.student.id
                }).exec(callback)
            },
            newy: callback => {
                News.count().exec(callback)
            }
        },
        (err, info) => {
            if (err) {
                return next(err)
            }
            res.render('student/student_home', {
                title: 'Student HomePage',
                allowed: req.session.student,
                person: info.user,
                courserep: () => {
                    if (info.user.is_courserep === 'Yes') {
                        return info.user.is_courserep
                    }
                },
                news: info.newy,
                message: req.flash('message')
            })
        }
    )
}

// Profile page for a specific Student.
exports.profiler = (req, res, next) => {
    StudentSigns.findById(req.session.student.id).exec((err, user) => {
        if (err) {
            return next(err)
        } // Error in API usage.
        if (user == null) {
            // No results.
            var err = new Error('Student not found')
            err.status = 404
            return next(err)
        }
        Courses.find({
            student_offering: req.session.student.id
        }).exec(function(err, mycourses) {
            if (err) {
                return next(err)
            }
            // Successful, so render.
            res.render('student/profiler', {
                allowed: req.session.student,
                title: 'Student Profile',
                layout: 'less_layout',
                user: user,
                registered_courses: mycourses,
                message: req.flash('message')
            })
        })
    })
}

// Display Student update form on GET.
exports.student_update_get = (req, res, next) => {
    StudentSigns.findById(req.session.student.id).exec((err, coursey) => {
        if (err) {
            return next(err)
        }
        if (coursey == null) {
            // No results.
            var err = new Error('Student not found')
            err.status = 404
            return next(err)
        }
        // Success.
        res.render('student/edit_profile', {
            title: 'Update Profile',
            layout: 'less_layout',
            allowed: req.session.student,
            coursey: coursey
        })
    })
}

exports.student_update_post = (req, res, next) => {
    var qualified = {
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        phone: req.body.phone,
        bio: req.body.bio,
        password: req.body.password
    }
    StudentSigns.findByIdAndUpdate(
        req.params.id,
        qualified, {},
        (err, studentupdate) => {
            if (err) {
                return next(err)
            }
            res.redirect(studentupdate.url)
        }
    )
}

exports.student_update_pics = (req, res, next) => {
    var fullPath = 'files/' + req.file.filename
    var qualified = {
        photo: fullPath,
        _id: req.params.id
    }
    StudentSigns.findByIdAndUpdate(
        req.session.student.id,
        qualified, {},
        (err, studentupdate) => {
            if (err) {
                return next(err)
            }
            res.redirect(studentupdate.url)
        }
    )
}

// GET Profile  of a student
exports.view_coursemate_profile = (req, res, next) => {
    StudentSigns.findById(req.params.id).exec((err, coursemate) => {
        if (err) {
            return next(err)
        }
        Courses.find({
            student_offering: req.params.id
        }).exec(function(err, mycourses) {
            if (err) {
                return next(err)
            }
            res.render('student/views_student', {
                allowed: req.session.student,
                title: 'CourseMate Profile',
                layout: 'less_layout',
                coursemate: coursemate,
                registered_courses: mycourses,
                photo: () => {
                    if (!coursemate.photo) {
                        coursemate.photo = '../images/psylogo4.jpg'
                        return coursemate.photo
                    } else {
                        return coursemate.photo
                    }
                },
                message: req.flash('message')
            })
        })
    })
}

// Functions for displaying just your coursemates
exports.list_coursemates = (req, res, next) => {
    StudentSigns.find({
        level: req.session.student.level
    }).exec((err, coursemate) => {
        if (err) {
            return next(err)
        }
        res.render('student/lists_students', {
            allowed: req.session.student,
            title: 'Complete List of your Course Mates',
            slow: coursemate,
            head: 'COURSEMATES'
        })
    })
}

// Functions for displaying just your coursemates
exports.list_psychology_students = (req, res, next) => {
    StudentSigns.find({}).exec((err, students) => {
        if (err) {
            return next(err)
        }
        res.render('student/lists_students', {
            allowed: req.session.student,
            title: 'ALL PSYCHOLOGY STUDENTS',
            slow: students,
            head: 'ALL PSYCHOLOGY STUDENTS'
        })
    })
}

// Functions for displaying just your coursemates
exports.list_100mates = (req, res, next) => {
    StudentSigns.find({
            level: 100
        },
        (err, students) => {
            if (err) {
                return next(err)
            }
            res.render('student/lists_students', {
                allowed: req.session.student,
                title: '100 LEVEL STUDENTS',
                slow: students,
                head: '100 LEVEL PSYCHOLOGY STUDENTS'
            })
        }
    )
}

// Functions for displaying just your coursemates
exports.list_200mates = (req, res, next) => {
    StudentSigns.find({
            level: 200
        },
        (err, students) => {
            if (err) {
                return next(err)
            }
            res.render('student/lists_students', {
                allowed: req.session.student,
                title: '200 LEVEL STUDENTS',
                slow: students,
                head: '200 LEVEL PSYCHOLOGY STUDENTS'
            })
        }
    )
}

// Functions for displaying just your coursemates
exports.list_300mates = (req, res, next) => {
    StudentSigns.find({
            level: 300
        },
        (err, students) => {
            if (err) {
                return next(err)
            }
            res.render('student/lists_students', {
                allowed: req.session.student,
                title: '300 LEVEL STUDENTS',
                slow: students,
                head: '300 LEVEL PSYCHOLOGY STUDENTS'
            })
        }
    )
}

// Functions for displaying just your coursemates
exports.list_400mates = (req, res, next) => {
    StudentSigns.find({
            level: 400
        },
        (err, students) => {
            if (err) {
                return next(err)
            }
            res.render('student/lists_students', {
                allowed: req.session.student,
                title: '400 LEVEL STUDENTS',
                slow: students,
                head: '400 LEVEL PSYCHOLOGY STUDENTS'
            })
        }
    )
}

// function for getting the names of every staff
exports.list_staffs = (req, res, next) => {
    Staff.find({}).exec((err, staffs) => {
        if (err) {
            return next(err)
        }
        res.render('student/list_staff', {
            allowed: req.session.student,
            title: 'Complete List of Staffs',
            slow: staffs
        })
    })
}

// GET Profile of a Particular Staff
exports.view_staff_profile = (req, res, next) => {
    async.parallel({
            coursey: callback => {
                Courses.find({
                    lecturer: req.params.id
                }).exec(callback)
            },
            staffy: callback => {
                Staff.findById(req.params.id).exec(callback)
            }
        },
        (err, staffs) => {
            if (err) {
                return next(err)
            }
            res.render('student/view_staff', {
                allowed: req.session.student,
                title: 'Staff Profile',
                layout: 'less_layout',
                staffs: staffs.staffy,
                coursess: staffs.coursey,
                photo: () => {
                    if (!staffs.staffy.photo) {
                        staffs.staffy.photo = '../images/psylogo4.jpg'
                        return staffs.staffy.photo
                    } else {
                        return staffs.staffy.photo
                    }
                }
            })
        }
    )
}

// GET Student latest NEWS
exports.get_last_news = (req, res, next) => {
    News.find({})
        .sort([
            ['created', 'ascending']
        ])
        .exec((err, news) => {
            if (err) {
                return next(err)
            }
            res.render('student/student_read_news', {
                allowed: req.session.student,
                title: 'Psychology News',
                newspaper: news,
                helpers: {
                    is_equal: function(a, b, opts) {
                        if (a === b) {
                            return opts.fn(this)
                        } else {
                            return opts.inverse(this)
                        }
                    },
                    truncate: function(a, b) {
                        const value = a.toString()
                        const limit = b
                        var text = ''
                        if (value.length > 0) {
                            text = text + value.substring(0, limit) + '...'
                        }
                        return text
                    }
                }
            })
        })
}

// GET Student full NEWS
exports.get_full_news = (req, res, next) => {
    News.findOne({
            _id: req.params.id
        },
        (err, news) => {
            if (err) {
                return next(err)
            }
            res.render('student/fullnews', {
                allowed: req.session.student,
                title: 'Psychology Full News',
                layout: 'less_layout',
                newspaper: news,
                comments: news.comments
            })
        }
    )
}

// Post Like News
exports.news_like = async(req, res, next) => {
    var look = req.session.student.id

    News.findOneAndUpdate({
            _id: req.params.id
        }, {
            $addToSet: {
                likey: look
            }
        },
        function(err, like) {
            if (err) {
                return next(err)
            }
            req.io.emit('likey', like.likey.length)
            res.json({
                status: 200,
                data: like
            })
        }
    )
}

// Post Like News
exports.news_dislike = async(req, res, next) => {
    var look = req.session.student.id

    News.findOneAndUpdate({
            _id: req.params.id
        }, {
            $addToSet: {
                dislikey: look
            }
        },
        function(err, dislike) {
            if (err) {
                return next(err)
            } else {
                req.io.emit('dislikey', dislike.dislikey.length)
                res.json({
                    status: 200,
                    data: dislike
                })
            }
        }
    )
}

// Student Post comments in a particular news
exports.post_comment_news = (req, res, next) => {
    let user = req.session.student
    let commentor = {
        userid: user.id,
        username: user.firstname,
        comment: req.body.comment
    }
    News.findByIdAndUpdate(
        req.params.id, {
            $push: {
                comments: commentor
            }
        },
        (err, cement) => {
            if (err) {
                return next(err)
            }
            req.io.of('/studentcomments/' + req.params.id).emit('chat_message', commentor)
            res.json({
                status: 200,
                data: cement
            })
        }
    )
}

// News reply comments
exports.news_reply_comment = (req, res, next) => {
    var replyObj = {
        commentId: req.body.commentId,
        user: req.session.student.firstname,
        replyee: req.body.replyer,
        reply: req.body.reply
    }
    News.findOneAndUpdate({
            _id: req.body.newsId,
            'comments._id': req.body.commentId
        }, {
            $push: {
                'comments.$.reply': replyObj
            }
        },
        function(err, cement) {
            if (err) {
                return next(err)
            }
            req.io.emit('reply_message', replyObj)
            res.json({
                status: 200,
                data: cement
            })
        }
    )
}

// Post Like comments
exports.post_like_comment = (req, res, next) => {
    News.findOne({
        'comments._id': req.params.id
    }).exec(function(err, ion) {
        if (err) {
            return next(err)
        }

        News.findOneAndUpdate({
                _id: ion.id,
                'comments._id': req.params.id
            }, {
                $inc: {
                    'comments.$.like': 1
                }
            },
            function(err, commet) {
                if (err) {
                    return next(err)
                }
                res.redirect('/studentgetfullnews/' + commet.id)
            }
        )
    })
}

// Post Like comments
exports.post_dislike_comment = (req, res, next) => {
    News.findOne({
        'comments._id': req.params.id
    }).exec(function(err, ion) {
        if (err) {
            return next(err)
        }

        News.findOneAndUpdate({
                _id: ion.id,
                'comments._id': req.params.id
            }, {
                $inc: {
                    'comments.$.dislike': 1
                }
            },
            function(err, commet) {
                if (err) {
                    return next(err)
                }
                res.redirect('/studentgetfullnews/' + commet.id)
            }
        )
    })
}

// GET List of 100Level Courses...
exports.get_100_courses = (req, res, next) => {
    async.parallel({
            first_semester: callback => {
                Courses.find({
                    level: 100,
                    semester: 1,
                    borrowed: 'no'
                }).exec(callback)
            },
            first_semester_borrowed: callback => {
                Courses.find({
                    level: 100,
                    semester: 1,
                    borrowed: 'yes'
                }).exec(callback)
            },
            second_semester: callback => {
                Courses.find({
                    level: 100,
                    semester: 2,
                    borrowed: 'no'
                }).exec(callback)
            },
            second_semester_borrowed: callback => {
                Courses.find({
                    level: 100,
                    semester: 2,
                    borrowed: 'yes'
                }).exec(callback)
            }
        },
        (err, hundred) => {
            if (err) {
                return next(err)
            }
            res.render('student/list_courses', {
                title: '100 Level Courses',
                layout: 'less_layout',
                allowed: req.session.student,
                levy: 100,
                first: hundred.first_semester,
                first_borrowed: hundred.first_semester_borrowed,
                second: hundred.second_semester,
                second_borrowed: hundred.second_semester_borrowed,
                elective1: 'ANY TWO',
                elective2: 'ANY TWO'
            })
        }
    )
}

// GET List of 200Level Courses...
exports.get_200_courses = (req, res, next) => {
    async.parallel({
            first_semester: callback => {
                Courses.find({
                    level: 200,
                    semester: 1,
                    borrowed: 'no'
                }).exec(callback)
            },
            first_semester_borrowed: callback => {
                Courses.find({
                    level: 200,
                    semester: 1,
                    borrowed: 'yes'
                }).exec(callback)
            },
            second_semester: callback => {
                Courses.find({
                    level: 200,
                    semester: 2,
                    borrowed: 'no'
                }).exec(callback)
            },
            second_semester_borrowed: callback => {
                Courses.find({
                    level: 200,
                    semester: 2,
                    borrowed: 'yes'
                }).exec(callback)
            }
        },
        (err, hundred) => {
            if (err) {
                return next(err)
            }
            res.render('student/list_courses', {
                title: '200 Level Courses',
                layout: 'less_layout',
                allowed: req.session.student,
                levy: 200,
                first: hundred.first_semester,
                first_borrowed: hundred.first_semester_borrowed,
                second: hundred.second_semester,
                second_borrowed: hundred.second_semester_borrowed,
                elective1: 'ANY TWO',
                elective2: 'ANY TWO'
            })
        }
    )
}

// GET List of 300Level Courses...
exports.get_300_courses = (req, res, next) => {
    async.parallel({
            first_semester: callback => {
                Courses.find({
                    level: 300,
                    semester: 1,
                    borrowed: 'no'
                }).exec(callback)
            },
            first_semester_borrowed: callback => {
                Courses.find({
                    level: 300,
                    semester: 1,
                    borrowed: 'yes'
                }).exec(callback)
            },
            second_semester: callback => {
                Courses.find({
                    level: 300,
                    semester: 2,
                    borrowed: 'no'
                }).exec(callback)
            },
            second_semester_borrowed: callback => {
                Courses.find({
                    level: 300,
                    semester: 2,
                    borrowed: 'yes'
                }).exec(callback)
            }
        },
        (err, hundred) => {
            if (err) {
                return next(err)
            }
            res.render('student/list_courses', {
                title: '300 Level Courses',
                layout: 'less_layout',
                allowed: req.session.student,
                levy: 300,
                first: hundred.first_semester,
                first_borrowed: hundred.first_semester_borrowed,
                second: hundred.second_semester,
                second_borrowed: hundred.second_semester_borrowed,
                elective1: 'ONE',
                elective2: 'ANY ONE'
            })
        }
    )
}

// GET List of 400Level Courses...
exports.get_400_courses = (req, res, next) => {
    async.parallel({
            first_semester: callback => {
                Courses.find({
                    level: 400,
                    semester: 1,
                    borrowed: 'no'
                }).exec(callback)
            },
            first_semester_borrowed: callback => {
                Courses.find({
                    level: 400,
                    semester: 1,
                    borrowed: 'yes'
                }).exec(callback)
            },
            second_semester: callback => {
                Courses.find({
                    level: 400,
                    semester: 2,
                    borrowed: 'no'
                }).exec(callback)
            },
            second_semester_borrowed: callback => {
                Courses.find({
                    level: 400,
                    semester: 2,
                    borrowed: 'yes'
                }).exec(callback)
            }
        },
        (err, hundred) => {
            if (err) {
                return next(err)
            }
            res.render('student/list_courses', {
                title: '400 Level Courses',
                layout: 'less_layout',
                allowed: req.session.student,
                levy: 400,
                first: hundred.first_semester,
                first_borrowed: hundred.first_semester_borrowed,
                second: hundred.second_semester,
                second_borrowed: hundred.second_semester_borrowed,
                elective2: 'ANY ONE'
            })
        }
    )
}

// GET detailed Page for a particular course
exports.view_courses = (req, res, next) => {
    Courses.findById(req.params.id).exec((err, course) => {
        if (err) {
            return next(err)
        }
        Staff.find({}).exec(function(err, staff) {
            if (err) {
                return next(err)
            }
            res.render('student/view_courses', {
                title: 'Psychology Course',
                layout: 'less_layout',
                allowed: req.session.student,
                kind: course,
                teacher: staff,
                succeed: req.flash('succeed'),
                war: req.flash('war'),
                lecky: () => {
                    let sortedLecturer = []
                    let courseLecturer = course.lecturer
                    let staffy = staff
                    courseLecturer.forEach(element => {
                        sortedLecturer.push(element)
                    })
                    var marvel = staffy.filter(function(lecturer) {
                        for (var i = 0; i < sortedLecturer.length; i++) {
                            if (sortedLecturer[i] == lecturer.id) {
                                return lecturer
                            }
                        }
                    })
                    return marvel
                }
            })
        })
    })
}

// GET List of students offering a course...
exports.student_course_registered = (req, res, next) => {
    Courses.findOne({
        _id: req.params.id
    }).exec((err, course) => {
        if (err) {
            return next(err)
        }
        StudentSigns.find({}).exec((err, students) => {
            if (err) {
                return next(err)
            }
            if (req.session.student.level >= course.level) {
                res.render('student/view_select', {
                    title: 'Student_Registered',
                    allowed: req.session.student,
                    courses: course,
                    upload: function() {
                        var sorted_registered = []
                        var chosen = []
                        var registered = course.student_offering
                        var deal = students
                        registered.forEach(element => {
                            sorted_registered.push(element)
                        })
                        deal.filter(hero => {
                            for (var i = 0; i < sorted_registered.length; i++) {
                                if (sorted_registered[i] == hero.id) {
                                    chosen.push(hero)
                                }
                            }
                        })
                        return chosen
                    }
                })
            } else {
                req.flash('succ', 'You can not view this course')
                res.redirect('/studentviewcourse/' + req.params.id)
            }
        })
    })
}

// student course registrations
exports.register_course = (req, res, next) => {
    var student = req.session.student
    Courses.findById(req.params.id).exec((err, course) => {
        if (err) {
            return next(err)
        }
        if (student.level >= course.level) {
            var de = {
                $addToSet: {
                    student_offering: student.id
                }
            }
            Courses.findOneAndUpdate({
                    _id: req.params.id
                },
                de, {},
                function(err) {
                    if (err) {
                        return next(err)
                    }
                    req.flash('succeed', 'Your Course registration was Successful')
                    res.redirect('/studentviewcourse/' + req.params.id)
                }
            )
        } else if (student.level < course.level) {
            req.flash(
                'war',
                'Your level is not eligible to register for this course'
            )
            res.redirect('/studentviewcourse/' + req.params.id)
        } else {}
    })
}

exports.delete_registered_course = function(req, res, next) {
    Courses.findOne({
        _id: req.params.id
    }).exec(function(err, course) {
        if (err) {
            return next(err)
        }

        course.student_offering.filter(student => {
            if (req.session.student.id == student) {
                console.log('You can delete this course')
                Courses.findOneAndUpdate({
                        _id: req.params.id
                    }, {
                        $pull: {
                            student_offering: req.session.student.id
                        }
                    },
                    function(err) {
                        if (err) {
                            return next(err)
                        }
                        req.flash(
                            'message',
                            'You have successfully deleted a course from your registered courses'
                        )
                        res.redirect('/studentss/' + req.session.student.id)
                    }
                )
            }
        })
    })
}

// GET Student PROJECT Topics
exports.get_project_topics = (req, res, next) => {
    Project.find({}).exec((err, release) => {
        if (err) {
            return next(err)
        }
        res.render('student/project_topics', {
            allowed: req.session.student,
            title: 'Psychology Project Topics',
            projectss: release
        })
    })
}

// GET already set time table for all student in a level
exports.get_time_table = (req, res, next) => {
    var student = req.session.student
    Timetable.find({
        level: student.level
    }).exec((err, times) => {
        if (err) {
            return next(err)
        }
        StudentSigns.findOne({
            _id: student.id
        }).exec(function(err, courserep) {
            if (err) {
                return next(err)
            }
            res.render('student/time_table', {
                title: "Student's TimeTable",
                allowed: req.session.student,
                update: req.flash('update'),
                studenty: () => {
                    if (courserep.is_courserep == 'Yes') {
                        return courserep.is_courserep
                    } else {}
                },
                monday: () => {
                    if (times) {
                        var mon = times.filter(hero => {
                            return hero.day == 'monday'
                        })
                        return mon
                    }
                },
                tuesday: () => {
                    if (times) {
                        var tue = times.filter(hero => {
                            return hero.day == 'tuesday'
                        })
                        return tue
                    }
                },
                wednesday: () => {
                    if (times) {
                        var wed = times.filter(hero => {
                            return hero.day == 'wednesday'
                        })
                        return wed
                    }
                },
                thursday: () => {
                    if (times) {
                        var thur = times.filter(hero => {
                            return hero.day == 'thursday'
                        })
                        return thur
                    }
                },
                friday: () => {
                    if (times) {
                        var fri = times.filter(hero => {
                            return hero.day == 'friday'
                        })
                        return fri
                    }
                }
            })
        })
    })
}

// Edit the time table by the course rep only
exports.edit_timetable = (req, res, next) => {
    Timetable.findOne({
        _id: req.params.id
    }).exec((err, timey) => {
        if (err) {
            return next(err)
        }
        Courses.find({
            level: req.session.student.level
        }).exec((err, course) => {
            if (err) {
                return next(err)
            }
            res.render('student/edit_timetable', {
                title: 'Edit Time Table',
                layout: 'less_layout',
                allowed: req.session.student,
                timey: timey,
                course: course
            })
        })
    })
}

// Post Edit the time table
exports.edit_post_timetable = (req, res, next) => {
    var timetable = {
        course: req.body.course
    }
    Timetable.findByIdAndUpdate(req.params.id, timetable, {}, function(err) {
        if (err) {
            return next(err)
        }
        req.flash('update', 'You have just updated a course in the Time table')
        res.redirect('/gettimetable')
    })
}

// function for checking students results
exports.my_result = (req, res, next) => {
    StudentSigns.findOne({
        _id: req.params.id
    }).exec((err, pupil) => {
        if (err) {
            return next(err)
        }
        console.log(pupil.level)
        if (req.session.student.level < pupil.level) {
            req.flash(
                'message',
                "This student is your senior colleague, so you can't view their result"
            )
            res.redirect('/studentstudentprofile/' + pupil.id)
        } else {
            Result.find({
                student: req.params.id
            }).exec((err, myresults) => {
                if (err) {
                    return next(err)
                }
                Courses.find({}).exec((err, coursess) => {
                    if (err) {
                        return next(err)
                    }
                    res.render('student/student_result', {
                        title: 'Personal Result',
                        layout: 'less_layout',
                        allowed: req.session.student,
                        oneresult: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 100 &&
                                            single_course.semester == 1
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        },
                        oneresult2: function() {
                            var real = []
                            var resulty = myresults
                            var coursey = coursess
                            resulty.forEach(read => {
                                coursey.filter(function(single_course) {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 100 &&
                                            single_course.semester == 2
                                        ) {
                                            var follow = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            real.push(follow)
                                        }
                                    }
                                })
                            })
                            return real
                        },
                        tworesult: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 200 &&
                                            single_course.semester == 1
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        },
                        tworesult2: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 100 &&
                                            single_course.semester == 2
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        },
                        threeresult: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 300 &&
                                            single_course.semester == 1
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        },
                        threeresult2: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 300 &&
                                            single_course.semester == 2
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        },
                        fourresult: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 400 &&
                                            single_course.semester == 1
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        },
                        fourresult2: () => {
                            var sorted_result = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter(single_course => {
                                    if (single_course.id == read.course) {
                                        if (
                                            single_course.level == 400 &&
                                            single_course.semester == 2
                                        ) {
                                            var convert = {
                                                coursecode: single_course.coursecode,
                                                coursetitle: single_course.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sorted_result.push(convert)
                                        }
                                    }
                                })
                            })
                            return sorted_result
                        }
                    })
                })
            })
        }
    })
}

exports.get_messages = function(req, res, next) {
    res.render('student/messages', {
        title: 'Messages',
        layout: 'less_layout',
        allowed: req.session.student
    })
}

exports.view_chat = function(req, res, next) {
    res.render('student/view_chat', {
        title: 'Messages',
        layout: 'less_layout',
        allowed: req.session.student
    })
}

// to Log-Out Students from the site
exports.logout = (req, res) => {
    if (req.session.student) {
        req.session.destroy()
    }
    res.redirect('/')
}