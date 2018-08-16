// This Codes is for calculating students results
//------------------------------------------------------------------------------


var user = [];


function addresult() {
    var user = this.user;
    var grades = ['A', 'B', 'C', 'D', 'E', 'F'];
    var courses = document.getElementById('courses').value;
    var scores = document.getElementById('scores').value;
    // for calculating the precise GRADE 
    function grade() {
        if (scores <= 39) {
            return grades[5];
        } else if (scores > 39 && scores <= 44) {
            return grades[4];
        } else if (scores > 44 && scores <= 49) {
            return grades[3];
        } else if (scores > 49 && scores <= 59) {
            return grades[2];
        } else if (scores > 59 && scores <= 69) {
            return grades[1];
        } else if (scores > 69 && scores <= 100) {
            return grades[0];
        } else {
            return;
        }
    };
    for (var i = 0; i < user.length; i++) {
        if (user[i][0] == courses) {
            alert("You've added " + user[i][0] + " before");
            return;
        }
        if (scores > 100) {
            alert("The score should NOT be higher than 100");
            return;
        }
        if (!Number(scores)) {
            alert("The score is not a number");
            return;
        }

    }

    this.user.push([courses, scores, grade()]);
    return document.getElementById('compute').innerHTML = user;
}

// ------------------------------------------------------------------------------
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({
    storage: storage
});

// function for getting the names of every student by their LEVELS
exports.list_students_by_level = function (req, res, next) {
    async.parallel({
        student_100: function (callback) {
            StudentSigns.find({
                    'level': 100
                })
                .exec(callback)
        },
        student_200: function (callback) {
            StudentSigns.find({
                    'level': 200
                })
                .exec(callback)
        },
        student_300: function (callback) {
            StudentSigns.find({
                'level': 300
            }).exec(callback)
        },
        student_400: function (callback) {
            StudentSigns.find({
                'level': 400
            })
        },
        function (err, swagger) {
            if (err) {
                return next(err);
            } else if (!swagger) {
                res.redirect('/');
            } else if (swagger.student) {
                res.render('admin/list_student', {
                    admin: req.session.admin,
                    title: "Complete List of Student",
                    message: "Complete List of Students",
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
            }
        }
    })
}