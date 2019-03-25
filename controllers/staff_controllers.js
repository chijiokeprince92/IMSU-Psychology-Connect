// This is the function for handling anything Staff

const Staff = require('../models/staffSchema')
const StudentSigns = require('../models/studentSchema')
const News = require('../models/newsSchema')
const Project = require('../models/projectSchema')
const Result = require('../models/resultSchema')
const Courses = require('../models/coursesSchema')
const Timetable = require('../models/timetableSchema')
var async = require('async')

// --------------------------------------------------------------------------------------------

exports.staffloginRequired = function(req, res, next) {
        if (!req.session.staff) {
            res.redirect('/staff/login')
        } else {
            return next()
        }
    }
    // ----------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------
// --------------------------------------------------------------------

// GET page for staff login
exports.staff_login_get = (req, res) => {
    res.render('staffs/login_staff', {
        title: 'staff_login',
        ohno: req.flash('ohno')
    })
}

// staff login POST
exports.staff_login_post = (req, res, next) => {
    Staff.findOne({
        'staff_id': req.body.staff_id
    }, (err, blade) => {
        if (err) {
            return next(err)
        } else if (!blade) {
            req.flash('ohno', 'Your staff_Id is incorrect')
            res.redirect('/staff/login')
        } else if (blade.password !== req.body.password) {
            // password is incorrect
            req.flash('ohno', 'Your Password is incorrect')
            res.redirect('/staff/login')
        } else {
            req.session.staff = blade.id
            req.flash('message', `Welcome ${blade.surname}, You are logged in`)
            res.redirect('/staff/staffhome')
        }
    })
}

exports.staff_home = (req, res, next) => {
    async.parallel({
        didi: (callback) => {
            Staff.findOne({
                '_id': req.session.staff
            }).exec(callback)
        },
        newy: (callback) => {
            News.count().exec(callback)
        }
    }, (err, name) => {
        if (err) {
            return next(err)
        }
        res.render('staffs/staff_home', {
            title: 'Staff Home Page',
            staff_session: req.session.staff,
            staffy: name.didi.surname,
            news: name.newy,
            message: req.flash('message')
        })
    })
}

// Display Author update form on GET.
exports.staff_update_get = (req, res, next) => {
    Staff.findById(req.session.staff, function(err, staff) {
        if (err) {
            return next(err)
        }
        // Success.
        res.render('staffs/edit_staff', {
            title: 'Update Profile',
            layout: 'less_layout',
            staff_session: req.session.staff,
            staff: staff
        })
    })
}

exports.staff_update_post = (req, res, next) => {
    var updated_staff = {
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        phone: req.body.phone,
        courses_lectured: req.body.courses_lectured,
        bio: req.body.bio,
        password: req.body.password
    }
    Staff.findByIdAndUpdate(req.session.staff, updated_staff, {}, function(err, staffupdate) {
        if (err) {
            return next(err)
        }
        res.redirect(staffupdate.url)
    })
}

exports.staff_update_pics = (req, res, next) => {
    var fullPath = 'files/' + req.file.filename
    var qualified = {
        photo: fullPath,
        _id: req.params.id
    }
    Staff.findByIdAndUpdate(req.session.staff, qualified, {}, function(err, staffupdate) {
        if (err) {
            return next(err)
        }
        res.redirect(staffupdate.url)
    })
}

// ---------------------------------------------------------------------------------------------
// Display detail page for a specific Staff.
exports.staff_profiler = function(req, res, next) {
    async.parallel({
        coursey: function(callback) {
            Courses.find({
                'lecturer': req.session.staff
            }).exec(callback)
        },
        staffy: function(callback) {
            Staff.findById(req.session.staff)
                .exec(callback)
        }
    }, (err, results) => {
        if (err) {
            return next(err)
        } // Error in API usage.
        // Successful, so render.
        res.render('staffs/staff_profiler', {
            title: 'Staff Profile',
            layout: 'less_layout',
            staff_session: req.session.staff,
            staff: results.staffy,
            coursess: results.coursey,
            photo: function() {
                if (!results.staffy.photo) {
                    results.staffy.photo = '../images/psylogo4.jpg'
                    return results.staffy.photo
                } else {
                    return results.staffy.photo
                }
            }

        })
    })
}

// GET the names of every student in Tabular form
exports.list_students = function(req, res, next) {
    StudentSigns.find()
        .sort([
            ['level', 'ascending']
        ])
        .exec(
            function(err, swag) {
                if (err) {
                    return next(err)
                }
                res.render('staffs/list_student', {
                    staff_session: req.session.staff,
                    title: 'Complete List of Student',
                    slow: swag,
                    heading: 'ALL PSYCHOLOGY STUDENTS'
                })
            }
        )
}

// GET Profile  of a student
exports.view_student_profile = function(req, res, next) {
    StudentSigns.findById(req.params.id)
        .exec(
            function(err, students) {
                if (err) {
                    return next(err)
                }
                Courses.find({
                        'student_offering': req.params.id
                    })
                    .exec(function(err, mycourses) {
                        if (err) {
                            return next(err)
                        }
                        res.render('staffs/view_students', {
                            staff_session: req.session.staff,
                            title: 'Student Profile',
                            layout: 'less_layout',
                            students: students,
                            registered_courses: mycourses,
                            photo: function() {
                                if (!students.photo) {
                                    students.photo = '../images/psylogo4.jpg'
                                    return students.photo
                                } else {
                                    return students.photo
                                }
                            }
                        })
                    })
            }
        )
}

// function for checking students results
exports.student_result = function(req, res, next) {
    Result.find({
            'student': req.params.id
        })
        .exec(function(err, myresults) {
            if (err) {
                return next(err)
            }
            Courses.find({})
                .exec((err, coursess) => {
                    if (err) {
                        return next(err)
                    }
                    res.render('staffs/view_result', {
                        title: 'Personal Result',
                        layout: 'less_layout',
                        staff_session: req.session.staff,
                        oneresult: () => {
                            var sortedResult = []
                            var result = myresults
                            var course = coursess
                            result.forEach(read => {
                                course.filter((singleCourse) => {
                                    if (singleCourse.id == read.course) {
                                        if (singleCourse.level == 100 && singleCourse.semester == 1) {
                                            var convert = {
                                                coursecode: singleCourse.coursecode,
                                                coursetitle: singleCourse.coursetitle,
                                                score: read.score,
                                                grade: read.grade
                                            }
                                            sortedResult.push(convert)
                                        }
                                    }
                                })
                            })
                            return sortedResult
                        },
                        oneresult2: function() {
                            var real = []
                            var resulty = myresults
                            var coursey = coursess
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
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 200 && single_course.semester == 1) {
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
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 100 && single_course.semester == 2) {
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
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 300 && single_course.semester == 1) {
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
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 300 && single_course.semester == 2) {
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
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 400 && single_course.semester == 1) {
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
                                course.filter((single_course) => {
                                    if (single_course.id == read.course) {
                                        if (single_course.level == 400 && single_course.semester == 2) {
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

// Functions for displaying students by their levels
exports.list_100_student = function(req, res, next) {
    StudentSigns.find({
        'level': 100
    }, function(err, swag) {
        if (err) {
            return next(err)
        }
        if (swag == null) {
            res.redirect('/staffhome')
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: 'Complete List of 100 Student',
            slow: swag,
            heading: '100 LEVEL STUDENTS'
        })
    })
}

exports.list_200_student = function(req, res, next) {
    StudentSigns.find({
        'level': 200
    }, function(err, swag) {
        if (err) {
            return next(err)
        }
        if (swag == null) {
            res.redirect('/staffhome')
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: 'Complete List of 200 Student',
            slow: swag,
            heading: '200 LEVEL STUDENTS'
        })
    })
}

exports.list_300_student = function(req, res, next) {
    StudentSigns.find({
        'level': 300
    }, function(err, swag) {
        if (err) {
            return next(err)
        }
        if (swag == null) {
            res.redirect('/staffhome')
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: 'Complete List of 300 Student',
            slow: swag,
            heading: '300 LEVEL STUDENTS'
        })
    })
}

exports.list_400_student = function(req, res, next) {
    StudentSigns.find({
        'level': 400
    }, function(err, swag) {
        if (err) {
            return next(err)
        }
        if (swag == null) {
            res.redirect('/staffhome')
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: 'Complete List of 400 Student',
            slow: swag,
            heading: '400 LEVEL STUDENTS'
        })
    })
}

// function for getting the names of every staff
exports.list_staffs = function(req, res, next) {
    Staff.find()
        .exec(function(err, swag) {
            if (err) {
                return next(err)
            }
            if (swag == null) {
                res.redirect('/staffhome')
            }
            res.render('staffs/list_staffs', {
                staff_session: req.session.staff,
                title: 'Complete List of Staffs',
                slow: swag
            })
        })
}

// GET Profile of a Particular Staff
exports.view_staff_profile = function(req, res, next) {
    async.parallel({
        coursey: function(callback) {
            Courses.find({
                'lecturer': req.params.id
            }).exec(callback)
        },
        staffy: function(callback) {
            Staff.findById(req.params.id).exec(callback)
        }
    }, function(err, staff) {
        if (err) {
            return next(err)
        }
        res.render('staffs/view_staffss', {
            staff_session: req.session.staff,
            title: 'Staff Profile',
            layout: 'less_layout',
            staff: staff.staffy,
            coursess: staff.coursey,
            photo: function() {
                if (!staff.staffy.photo) {
                    staff.staffy.photo = '../images/psylogo4.jpg'
                    return staff.staffy.photo
                } else {
                    return staff.staffy.photo
                }
            }
        })
    })
}

// GET List of 100Level Courses...
exports.get_100_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback)
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback)
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback)
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback)
        }
    }, function(err, hundred) {
        if (err) {
            return next(err)
        }
        if (hundred.first_semester == null) {
            res.redirect('/')
        }
        res.render('staffs/list_courses', {
            title: '100 Level Courses',
            layout: 'less_layout',
            staff_session: req.session.staff,
            levy: 100,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective1: 'ANY TWO',
            elective2: 'ANY TWO'
        })
    })
}

// GET List of 200Level Courses...
exports.get_200_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback)
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback)
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback)
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback)
        }
    }, function(err, hundred) {
        if (err) {
            return next(err)
        }
        if (hundred.first_semester == null) {
            res.redirect('/getallcourses')
        }
        res.render('staffs/list_courses', {
            title: '200 Level Courses',
            layout: 'less_layout',
            staff_session: req.session.staff,
            levy: 200,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective1: 'ANY TWO',
            elective2: 'ANY TWO'
        })
    })
}

// GET List of 300Level Courses...
exports.get_300_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback)
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback)
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback)
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback)
        }
    }, function(err, hundred) {
        if (err) {
            return next(err)
        }
        if (hundred.first_semester == null) {
            res.redirect('/')
        }
        res.render('staffs/list_courses', {
            title: '300 Level Courses',
            layout: 'less_layout',
            staff_session: req.session.staff,
            levy: 300,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective1: 'ONE',
            elective2: 'ANY ONE'
        })
    })
}

// GET List of 400Level Courses...
exports.get_400_courses = function(req, res, next) {
    async.parallel({
        first_semester: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'no'
            }).exec(callback)
        },
        first_semester_borrowed: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'yes'
            }).exec(callback)
        },
        second_semester: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'no'
            }).exec(callback)
        },
        second_semester_borrowed: function(callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'yes'
            }).exec(callback)
        }
    }, function(err, hundred) {
        if (err) {
            return next(err)
        }
        if (hundred.first_semester == null) {
            res.redirect('/')
        }
        res.render('staffs/list_courses', {
            title: '400 Level Courses',
            layout: 'less_layout',
            staff_session: req.session.staff,
            levy: 400,
            first: hundred.first_semester,
            first_borrowed: hundred.first_semester_borrowed,
            second: hundred.second_semester,
            second_borrowed: hundred.second_semester_borrowed,
            elective2: 'ANY ONE'
        })
    })
}

// GET detailed Page for a particular course
exports.view_courses = function(req, res, next) {
    Courses.findById(req.params.id)
        .exec(function(err, course) {
            if (err) {
                return next(err)
            }
            Staff.find({})
                .exec(function(err, staff) {
                    if (err) {
                        return next(err)
                    }
                    res.render('staffs/view_courses', {
                        title: 'Psychology Course',
                        staff_session: req.session.staff,
                        course: course,
                        teacher: staff,
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
exports.student_course_registered = function(req, res, next) {
    Courses.findOne({
        '_id': req.params.id
    }).exec((err, course) => {
        if (err) {
            return next(err)
        }
        StudentSigns.find({})
            .exec((err, students) => {
                if (err) {
                    return next(err)
                }
                res.render('staffs/view_select', {
                    title: 'Student_Registered',
                    staff_session: req.session.staff,
                    courses: course,
                    upload: function() {
                        var sortedRegistered = []
                        var chosen = []
                        var registered = course.student_offering
                        var deal = students
                        registered.forEach(element => {
                            sortedRegistered.push(element)
                        })
                        deal.filter((hero) => {
                            for (var i = 0; i < sortedRegistered.length; i++) {
                                if (sortedRegistered[i] == hero.id) {
                                    chosen.push(hero)
                                }
                            }
                        })
                        return chosen
                    }
                })
            })
    })
}

exports.edit_courseoutline = function(req, res, next) {
    var course = {
        courseoutline: req.body.courseoutline
    }
    Courses.findByIdAndUpdate(req.params.id, course, {}, function(err, courseupdate) {
        if (err) {
            return next(err)
        }
        res.redirect(courseupdate.lect)
    })
}

// GET Admin latest NEWS
exports.get_last_news = function(req, res, next) {
    News.find({}).sort([
        ['created', 'ascending']
    ]).exec(function(err, release) {
        if (err) {
            return next(err)
        }
        if (release == null) {
            res.send('There is no NEWS Content')
        }
        res.render('staffs/staff_read_news', {
            staff_session: req.session.staff,
            title: 'Psychology News',
            newspaper: release,
            helpers: {
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

// GET Admin full NEWS
exports.get_full_news = function(req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function(err, release) {
        if (err) {
            return next(err)
        }
        res.render('staffs/fullnews', {
            staff_session: req.session.staff,
            layout: 'less_layout',
            title: 'Psychology Full News',
            newspaper: release,
            comments: release.comments
        })
    })
}

// Post comments
exports.post_comment_news = function(req, res, next) {
    Staff.findById(req.session.staff)
        .exec(function(err, namey) {
            var commerce = {
                user: 'Staff: ' + namey.firstname,
                comment: req.body.comment
            }
            if (err) {
                return next(err)
            }
            News.findByIdAndUpdate(req.params.id, {
                $push: {
                    comments: commerce
                }
            }, function(err, commet) {
                if (err) {
                    return next(err)
                }
                res.redirect('/staffgetfullnews/' + commet.id)
            })
        })
}

// GET Staff PROJECT Topics
exports.get_project_topics = function(req, res, next) {
    Project.find({}, function(err, release) {
        if (err) {
            return next(err)
        }
        res.render('staffs/staff_projecttopic', {
            staff_session: req.session.staff,
            title: 'Psychology Project Topics',
            projectss: release
        })
    })
}

exports.get_schedule = function(req, res, next) {
    Courses.find({ 'lecturer': req.session.staff }, function(err, success) {
        if (err) {
            return next(err)
        }
        Timetable.find({}, function(err, time) {
            if (err) {
                return next(err)
            }
            res.render('staffs/schedule', {
                title: 'Staff Schedule',
                staff_session: req.session.staff,
                courses: success,
                monday: function() {
                    var free = []
                    var chosen = []
                    var courses = success
                    var timey = time
                    courses.forEach(elem => {
                        free.push(elem.coursecode)
                    })
                    timey.filter((thor) => {
                        for (var i = 0; i < free.length; i++) {
                            if (free[i] == thor.course) {
                                if (thor.day == 'monday') {
                                    chosen.push({
                                        course: thor.course,
                                        day: thor.day,
                                        time: thor.time,
                                        level: thor.level
                                    })
                                }
                            }
                        }
                    })
                    return chosen
                },
                tuesday: function() {
                    var free = []
                    var chosen = []
                    var courses = success
                    var timey = time
                    courses.forEach(elem => {
                        free.push(elem.coursecode)
                    })
                    timey.filter((thor) => {
                        for (var i = 0; i < free.length; i++) {
                            if (free[i] == thor.course) {
                                if (thor.day == 'tuesday') {
                                    chosen.push({
                                        course: thor.course,
                                        day: thor.day,
                                        time: thor.time,
                                        level: thor.level
                                    })
                                }
                            }
                        }
                    })
                    return chosen
                },
                wednesday: function() {
                    var free = []
                    var chosen = []
                    var courses = success
                    var timey = time
                    courses.forEach(elem => {
                        free.push(elem.coursecode)
                    })
                    timey.filter((thor) => {
                        for (var i = 0; i < free.length; i++) {
                            if (free[i] == thor.course) {
                                if (thor.day == 'wednesday') {
                                    chosen.push({
                                        course: thor.course,
                                        day: thor.day,
                                        time: thor.time,
                                        level: thor.level
                                    })
                                }
                            }
                        }
                    })
                    return chosen
                },
                thursday: function() {
                    var free = []
                    var chosen = []
                    var courses = success
                    var timey = time
                    courses.forEach(elem => {
                        free.push(elem.coursecode)
                    })
                    timey.filter((thor) => {
                        for (var i = 0; i < free.length; i++) {
                            if (free[i] == thor.course) {
                                if (thor.day == 'thursday') {
                                    chosen.push({
                                        course: thor.course,
                                        day: thor.day,
                                        time: thor.time,
                                        level: thor.level
                                    })
                                }
                            }
                        }
                    })
                    return chosen
                },
                friday: function() {
                    var free = []
                    var chosen = []
                    var courses = success
                    var timey = time
                    courses.forEach(elem => {
                        free.push(elem.coursecode)
                    })
                    timey.filter((thor) => {
                        for (var i = 0; i < free.length; i++) {
                            if (free[i] == thor.course) {
                                if (thor.day == 'friday') {
                                    chosen.push({
                                        course: thor.course,
                                        day: thor.day,
                                        time: thor.time,
                                        level: thor.level
                                    })
                                }
                            }
                        }
                    })
                    return chosen
                },
                helpers: {
                    isEqual: function(a, b, opts) {
                        if (a == b) {
                            return opts.fn(this)
                        } else {
                            return opts.inverse(this)
                        }
                    }
                }
            })
        })
    })
}

exports.upload_projects = function(req, res) {
    res.render('staffs/upload_projects', {
        title: 'Staff Upload Projects',
        staff_session: req.session.staff
    })
}

exports.get_messages = function(req, res) {
    res.render('staffs/messages', {
        title: 'Messages',
        layout: 'less_layout',
        staff_session: req.session.staff
    })
}

// to Log-Out Staffs from the site
exports.staff_logout = function(req, res) {
    if (req.session.staff) {
        req.session.destroy()
    }
    res.redirect('/')
}