const StudentSigns = require('../models/studentSchema');
const Staff = require('../models/staffSchema');
const async = require('async');

//------------------------------------------------------------------------------
//ADMIN Functions

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
                message: "Complete List of Students",
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

// function for sending message to all levels

exports.send_100 = function (req, res, next) {
    res.render('student/chat100', {
        title: "100Level Group Chat",
        admin_session: req.session.admin
    })
}

exports.send_200 = function (req, res, next) {
    res.render('student/chat200', {
        title: "200 Level Group Chat",
        admin_session: req.session.admin
    });
}

exports.send_300 = function (req, res, next) {
    res.render('student/chat300', {
        title: "300Level Group Chat",
        admin_session: req.session.admin
    });
}

exports.send_400 = function (req, res, next) {
    res.render('student/chat400', {
        title: "400Level Group chat",
        admin_session: req.session.admin
    });
}