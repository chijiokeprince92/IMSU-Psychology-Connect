// This is the function for handling anything Staff

var Staff = require('../models/staffSchema');
const StudentSigns = require('../models/studentSchema');
const News = require('../models/newsSchema');
const Project = require('../models/projectSchema');
const Courses = require('../models/coursesSchema');
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

    async.parallel({
        didi: function (callback) {
            Staff.findOne({
                '_id': req.session.staff
            }).exec(callback);
        },
        newy: function (callback) {
            News.count().exec(callback);
        }
    }, function (err, name) {
        if (err) {
            return next(err);
        }
        res.render('staffs/staff_home', {
            title: 'Staff Home Page',
            staff_session: req.session.staff,
            staffy: name.didi.surname,
            news: name.newy
        });
    })

};

//-------------------------------------------------------------------------------------------
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
        'staff_id': req.body.staff_id
    }, function (err, blade) {
        if (err) {
            return next(err);
        }
        if (!blade) {
            res.render('homefile/login_staff', {
                title: 'Staff_Login',
                ohno: "Your Staff_id is incorrect..."
            });
            return;
        } else if (blade.password !== req.body.password) {
            //password is incorrect
            res.render('homefile/login_staff', {
                title: 'Staff_Login',
                ohno: 'Password is incorrect'
            });
            return;
        } else if (blade && blade.password == req.body.password) {
            req.session.staff = blade.id;
            res.render('staffs/staff_home', {
                title: 'Staff Home Page',
                staff_session: req.session.staff,
                staffy: blade.surname
            });
        } else {
            res.redirect('/stafflogin');
        }
    });

};

// Display Author update form on GET.
exports.staff_update_get = function (req, res, next) {

    Staff.findById(req.params.id, function (err, coursey) {
        if (err) {
            return next(err);
        }
        // Success.
        res.render('staffs/edit_staff', {
            title: 'Update Profile',
            staff_session: req.session.staff,
            coursey: coursey
        });
    });
};


exports.staff_update_post = function (req, res, next) {
    var freedom = new Staff({
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        phone: req.body.phone,
        courses_lectured: req.body.courses_lectured,
        bio: req.body.bio,
        password: req.body.password,
        _id: req.params.id
    });
    Staff.findByIdAndUpdate(req.params.id, freedom, {
        new: true
    }, function (err, staffupdate) {
        console.log(err)
        if (err) {
            return next(err);
        }
        res.redirect(staffupdate.url);
    });
}

exports.staff_update_pics = function (req, res, next) {
    var fullPath = "files/" + req.file.filename;
    var qualified = new Staff({
        photo: fullPath,
        _id: req.params.id
    });
    Staff.findByIdAndUpdate(req.params.id, qualified, {}, function (err, staffupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(staffupdate.url);
    });
}

//---------------------------------------------------------------------------------------------
// Display detail page for a specific Staff.
exports.staff_profiler = function (req, res, next) {
    async.parallel({
        coursey: function (callback) {
            Courses.find({
                'lecturer': req.session.staff
            }).exec(callback);
        },
        staffy: function (callback) {
            Staff.findById(req.session.staff).exec(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        } // Error in API usage.
        if (results == null) { // No results.
            var err = new Error('You are not a Staff');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('staffs/staff_profiler', {
            title: 'Staff Profile',
            staff_session: req.session.staff,
            staff_email: results.staffy.email,
            staff_surname: results.staffy.surname,
            staff_firstname: results.staffy.firstname,
            staff_id: results.staffy.staff_id,
            staff_gender: results.staffy.gender,
            staff_phone: results.staffy.phone,
            staff_bio: results.staffy.bio,
            urlline: results.staffy.id,
            coursess: results.coursey,
            staff_photo: function () {
                if (!results.staffy.photo) {
                    results.staffy.photo = "../images/psylogo4.jpg";
                    return results.staffy.photo;
                } else {
                    return results.staffy.photo;
                }
            }
        });
    });
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
                    slow: swag,
                    heading: "ALL PSYCHOLOGY STUDENTS"
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
                    bio: swag.bio,
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
    }, function (err, swag) {
        if (err) {
            return next(err);
        }
        if (swag == null) {
            res.redirect('/staffhome');
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: "Complete List of 100 Student",
            slow: swag,
            heading: "100 LEVEL STUDENTS"
        });
    })
}

exports.list_200_student = function (req, res, next) {
    StudentSigns.find({
        'level': 200
    }, function (err, swag) {
        if (err) {
            return next(err);
        }
        if (swag == null) {
            res.redirect('/staffhome');
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: "Complete List of 200 Student",
            slow: swag,
            heading: "200 LEVEL STUDENTS"
        });
    })
}

exports.list_300_student = function (req, res, next) {
    StudentSigns.find({
        'level': 300
    }, function (err, swag) {
        if (err) {
            return next(err);
        }
        if (swag == null) {
            res.redirect('/staffhome');
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: "Complete List of 300 Student",
            slow: swag,
            heading: "300 LEVEL STUDENTS"
        });
    })
}

exports.list_400_student = function (req, res, next) {
    StudentSigns.find({
        'level': 400
    }, function (err, swag) {
        if (err) {
            return next(err);
        }
        if (swag == null) {
            res.redirect('/staffhome');
        }
        res.render('staffs/list_student', {
            staff_session: req.session.staff,
            title: "Complete List of 400 Student",
            slow: swag,
            heading: "400 LEVEL STUDENTS"
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
        res.render('staffs/view_staffss', {
            staff_session: req.session.staff,
            title: "Staff Profile",
            email: swag.staffy.email,
            surname: swag.staffy.surname,
            firstname: swag.staffy.firstname,
            gender: swag.staffy.gender,
            phone: swag.staffy.phone,
            quote: swag.staffy.bio,
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
    })
}

// GET List of 100Level Courses...
exports.get_100_courses = function (req, res, next) {
    async.parallel({
        first_semester: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'no'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 1,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'no'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 100,
                'semester': 2,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('staffs/list_courses', {
            title: "100 Level Courses",
            staff_session: req.session.staff,
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
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 1,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'no'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 200,
                'semester': 2,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/getallcourses');
        }
        res.render('staffs/list_courses', {
            title: "200 Level Courses",
            staff_session: req.session.staff,
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
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 1,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'no'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 300,
                'semester': 2,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('staffs/list_courses', {
            title: "300 Level Courses",
            staff_session: req.session.staff,
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
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        first_semester_borrowed: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 1,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'no'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
        second_semester_borrowed: function (callback) {
            Courses.find({
                'level': 400,
                'semester': 2,
                'borrowed': 'yes'
            }).sort([
                ['created', 'ascending']
            ]).exec(callback);
        },
    }, function (err, hundred) {
        if (err) {
            return next(err);
        }
        if (hundred.first_semester == null) {
            res.redirect('/');
        }
        res.render('staffs/list_courses', {
            title: "400 Level Courses",
            staff_session: req.session.staff,
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
exports.view_courses = function (req, res, next) {
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
                    res.render('staffs/view_courses', {
                        title: 'Psychology Course',
                        staff_session: req.session.staff,
                        kind: course,
                        teacher: staff
                    });
                });
        });
}

exports.edit_courseoutline = function (req, res, next) {
    var course = new Courses({
        courseoutline: req.body.courseoutline,
        _id: req.params.id
    });
    Courses.findByIdAndUpdate(req.params.id, course, {}, function (err, courseupdate) {
        if (err) {
            return next(err);
        }
        res.redirect(courseupdate.urly);
    });
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

// GET Admin full NEWS
exports.get_full_news = function (req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function (err, release) {
        if (err) {
            return next(err);
        }
        res.render('staffs/fullnews', {
            staff_session: req.session.staff,
            title: 'Psychology Full News',
            newspaper: release
        });
    })
}

// GET Staff PROJECT Topics
exports.get_project_topics = function (req, res, next) {
    Project.find({}, function (err, release) {
        if (err) {
            return next(err);
        }
        if (release == null) {
            res.send('There is no PROJECT Content');
        }
        res.render('staffs/staff_projecttopic', {
            staff_session: req.session.staff,
            title: 'Psychology Project Topics',
            projectss: release
        });
    })
}

exports.get_schedule = function (req, res, next) {
    res.render('staffs/schedule', {
        title: "Staff Schedule",
        staff_session: req.session.staff
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