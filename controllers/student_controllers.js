// this is the controller for handling anything student

const StudentSigns = require('../models/studentSchema')
const Staff = require('../models/staffSchema')
const Messages = require('../models/messageSchema')
const Conversation = require('../models/conversationSchema')
const News = require('../models/newsSchema')
const Project = require('../models/projectSchema')
const Courses = require('../models/coursesSchema')
const Result = require('../models/resultSchema')
const Timetable = require('../models/timetableSchema')
const formidable = require('formidable')
const cloudinary = require('cloudinary')
const moment = require('moment')

const async = require('async')

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
  if (req.session.student.id !== req.params.id) {
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
  body('bio')
    .isLength({
      min: 1
    })
    .trim()
    .withMessage('status must be specified.'),
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
  sanitizeBody('bio')
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
      res.render('homefile/student_signup', {
        title: 'Create Student',
        student: req.body,
        errors: errors.array()
      })
    } else {
      // Data from form is valid.
      // Create an Student object with escaped and trimmed data.
      var qualified = new StudentSigns({
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        matnumber: req.body.matnumber,
        level: req.body.level,
        gender: req.body.gender,
        phone: req.body.phone,
        bio: req.body.bio,
        date: new Date(),
        updated: new Date(),
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
    layout: 'less_layout',
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
      req.flash('ohno', 'Password is Incorrect')
      res.redirect(302, '/login')
    } else if (user && user.password === req.body.password) {
      req.session.student = {
        id: user.id,
        level: user.level,
        matnumber: user.matnumber,
        firstname: user.firstname,
        surname: user.surname,
        photo: user.photo.url || '/images/psylogo4.jpg'
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
      news: info.newy,
      message: req.flash('message')
    })
  }
  )
}

// Profile page for a specific Student.
exports.profiler = (req, res, next) => {
  StudentSigns.findById(req.params.id).exec((err, user) => {
    if (err) {
      return next(err)
    } // Error in API usage.
    Courses.find({
      student_offering: req.session.student.id
    }).exec(function (err, mycourses) {
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
        message: req.flash('message'),
        helpers: {
          datey: function (data) {
            return moment(data).format('dddd,MMMM Do YYYY')
          }
        }
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
    updated: new Date(),
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

// Upload your profile pics
exports.student_update_pics = async (req, res, next) => {
  await StudentSigns.findByIdAndRemove(req.session.student.id, function (err, delprofilepic) {
    if (err) {
      return next(err)
    }
    cloudinary.v2.uploader.destroy(delprofilepic.photo.public_id, function (err) {
      if (err) {
        return next(err)
      }
    })
  })
  
  var form = new formidable.IncomingForm()
  form.parse(req)
  form.on('fileBegin', function (name, file) {
    // eslint-disable-next-line no-path-concat
    file.path = __dirname + '/formidable/' + file.name
    console.log('The name of the selected file is:', file.path)
  })
  form.on('file', function (name, file) {
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      console.log('The file is not a picture')
      req.flash('message', 'The file you uploaded was not a picture')
      res.redirect(301, '/studentss/' + req.session.student.id)
    } else {
      console.log('The file is a picture')
      cloudinary.v2.uploader.upload(file.path, function (err, result) {
        if (err) {
          return next(err)
        }
        console.log(result)
        // add cloudinary url for the image to the topic object under image property
        var qualified = {
          photo: {
            url: result.secure_url,
            public_id: result.public_id
          }
        }
        StudentSigns.findByIdAndUpdate(req.session.student.id, qualified, {},
          (err, studentupdate) => {
            if (err) {
              return next(err)
            }
            res.redirect(studentupdate.url)
          })
      })
    }
  })
}

// GET Profile  of a student
exports.view_coursemate_profile = (req, res, next) => {
  StudentSigns.findById(req.params.id).exec((err, coursemate) => {
    if (err) {
      return next(err)
    }
    Courses.find({
      student_offering: req.params.id
    }).exec(function (err, students) {
      if (err) {
        return next(err)
      }
      res.render('student/views_student', {
        allowed: req.session.student,
        title: 'CourseMate Profile',
        layout: 'less_layout',
        coursemate: coursemate,
        registered_courses: students,
        message: req.flash('message'),
        helpers: {
          datey: function (data) {
            return moment(data).format('dddd,MMMM Do YYYY')
          }
        }
      })
    })
  })
}

// Functions for displaying just your coursemates
exports.list_psychology_students = (req, res, next) => {
  StudentSigns.find({}).sort([
    ['level', 'ascending'], ['updated', 'descending']
  ]).exec((err, students) => {
    if (err) {
      return next(err)
    }
    res.render('student/lists_students', {
      allowed: req.session.student,
      title: 'ALL PSYCHOLOGY STUDENTS',
      slow: students,
      head: 'ALL PSYCHOLOGY STUDENTS',
      helpers: {
        isEqual: function (a, opts) {
          if (a == req.session.student.id) {
            return opts.fn(this)
          } else {
            return opts.inverse(this)
          }
        }
      }
    })
  })
}

// Functions for displaying just your coursemates
exports.list_coursemates = (req, res, next) => {
  StudentSigns.find({ level: req.params.level }).sort([
    ['level', 'ascending'], ['updated', 'descending']
  ]).exec((err, students) => {
    if (err) {
      return next(err)
    }
    res.render('student/lists_students', {
      allowed: req.session.student,
      title: `${req.params.level} LEVEL STUDENTS`,
      slow: students,
      head: `${req.params.level} LEVEL PSYCHOLOGY STUDENTS`,
      helpers: {
        isEqual: function (a, opts) {
          if (a == req.session.student.id) {
            return opts.fn(this)
          } else {
            return opts.inverse(this)
          }
        }
      }
    })
  }
  )
}

// GET already set time table for all student in a level
exports.get_time_table = (req, res, next) => {
  var student = req.session.student
  let datey = function (time, day) {
    var mon = time.filter(hero => {
      return hero.day == `${day}`
    })
    return mon
  }
  Timetable.find({
    level: student.level
  }).exec((err, times) => {
    if (err) {
      return next(err)
    }
    StudentSigns.findOne({
      _id: student.id
    }).exec(function (err, courserep) {
      if (err) {
        return next(err)
      }
      res.render('student/time_table', {
        title: "Student's TimeTable",
        allowed: req.session.student,
        update: req.flash('update'),
        studenty: courserep.is_courserep,
        monday: datey(times, 'monday'),
        tuesday: datey(times, 'tuesday'),
        wednesday: datey(times, 'wednesday'),
        thursday: datey(times, 'thursday'),
        friday: datey(times, 'friday')
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
  Timetable.findByIdAndUpdate(req.params.id, timetable, {}, function (err) {
    if (err) {
      return next(err)
    }
    req.flash('update', 'You have just updated a course in the Time table')
    res.redirect(302, '/gettimetable')
  })
}

// function for checking students results
exports.my_result = (req, res, next) => {
  // function for calculating CGPA
  let calculateCgpa = function (resul) {
    let sortedResult = []
    let average = []
    resul.forEach(read => {
      if (read.grade == 'A') {
        sortedResult.push(5 * Number(read.unit))
        average.push(Number(read.unit))
      } else if (read.grade == 'B') {
        sortedResult.push(4 * Number(read.unit))
        average.push(Number(read.unit))
      } else if (read.grade == 'C') {
        sortedResult.push(3 * Number(read.unit))
        average.push(Number(read.unit))
      } else if (read.grade == 'D') {
        sortedResult.push(2 * Number(read.unit))
        average.push(Number(read.unit))
      } else if (read.grade == 'E') {
        sortedResult.push(1 * Number(read.unit))
        average.push(Number(read.unit))
      } else if (read.grade == 'F') {
        sortedResult.push(0 * Number(read.unit))
        average.push(Number(read.unit))
      }
    })
    let final = sortedResult.reduce(function (a, b) {
      return a + b
    }, 0)
    let ave = average.reduce(function (a, b) {
      return a + b
    }, 0)
    // round up the GP to the nearest number to two decimal place
    return Math.round(final / ave * 100) / 100
  }

  // funcion for producing the result for a semester
  let calculateResult = function (resul, cour, leve, semest) {
    let embrace = {
      rest: [],
      cgpa: ''
    }
    resul.forEach(read => {
      cour.filter(singleCourse => {
        if (singleCourse.id == read.course) {
          if (
            singleCourse.level == leve &&
            singleCourse.semester == semest
          ) {
            var convert = {
              coursecode: singleCourse.coursecode,
              coursetitle: singleCourse.coursetitle,
              score: read.score,
              grade: read.grade,
              unit: singleCourse.units
            }
            embrace.rest.push(convert)
          }
        }
      })
    })
    if (embrace.rest.length > 0) {
      embrace.cgpa = calculateCgpa(embrace.rest)
    } else {
      embrace.cgpa = 0
    }
    return embrace
  }

  StudentSigns.findOne({
    _id: req.params.id
  }).exec((err, pupil) => {
    if (err) {
      return next(err)
    }
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
            oneresult: calculateResult(myresults, coursess, 100, 1),
            oneresult2: calculateResult(myresults, coursess, 100, 2),
            tworesult: calculateResult(myresults, coursess, 200, 1),
            tworesult2: calculateResult(myresults, coursess, 200, 2),
            threeresult: calculateResult(myresults, coursess, 300, 1),
            threeresult2: calculateResult(myresults, coursess, 300, 2),
            fourresult: calculateResult(myresults, coursess, 400, 1),
            fourresult2: calculateResult(myresults, coursess, 400, 2)
          })
        })
      })
    }
  })
}

exports.get_courses = (req, res, next) => {
  async.parallel({
    first_semester: callback => {
      Courses.find({
        level: req.params.level,
        semester: 1,
        borrowed: 'no'
      }).exec(callback)
    },
    first_semester_borrowed: callback => {
      Courses.find({
        level: req.params.level,
        semester: 1,
        borrowed: 'yes'
      }).exec(callback)
    },
    second_semester: callback => {
      Courses.find({
        level: req.params.level,
        semester: 2,
        borrowed: 'no'
      }).exec(callback)
    },
    second_semester_borrowed: callback => {
      Courses.find({
        level: req.params.level,
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
      title: `${req.params.level} Level Courses`,
      layout: 'less_layout',
      allowed: req.session.student,
      levy: req.params.level,
      first: hundred.first_semester,
      first_borrowed: hundred.first_semester_borrowed,
      second: hundred.second_semester,
      second_borrowed: hundred.second_semester_borrowed,
      elective1: function () {
        if (req.params.level == 300) {
          return 'ONE'
        } else if (req.params.level == 400) {
          return ''
        } else {
          return 'ANY TWO'
        }
      },
      elective2: function () {
        if (req.params.level == 300 || req.params.level == 400) {
          return 'ANY ONE'
        } else {
          return 'ANY TWO'
        }
      }
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
    Staff.find({}).exec(function (err, staff) {
      if (err) {
        return next(err)
      }
      StudentSigns.find({}).sort([
        ['level', 'ascending']
      ]).exec((err, students) => {
        if (err) {
          return next(err)
        }
        res.render('student/view_courses', {
          title: 'Psychology Course',
          layout: 'less_layout',
          allowed: req.session.student,
          course: course,
          teacher: staff,
          succeed: req.flash('succeed'),
          war: req.flash('war'),
          registered: function () {
            let isRegistered = false
            for (let i = 0; i < course.student_offering.length; i++) {
              if (course.student_offering[i] == req.session.student.id) {
                isRegistered = true
              } else {
              }
            }
            return isRegistered
          },
          staffed: () => {
            let courseLecturer = course.lecturer
            var marvel = staff.filter(function (lecturer) {
              for (var i = 0; i < courseLecturer.length; i++) {
                if (courseLecturer[i] == lecturer.id) {
                  return lecturer
                }
              }
            })
            return marvel
          },
          studunt: function () {
            var chosen = []
            var registered = course.student_offering
            students.filter(hero => {
              for (var i = 0; i < registered.length; i++) {
                if (registered[i] == hero.id) {
                  chosen.push(hero)
                }
              }
            })
            return chosen
          }
        })
      })
    })
  })
}

// working on it
exports.register_course = (req, res, next) => {
  Result.findOne({
    'course': req.params.id,
    'student': req.session.student.id
  }).exec(function (err, results) {
    if (err) {
      return next(err)
    }
    if (!results) {
      var student = req.session.student
      Courses.findById(req.params.id).exec((err, course) => {
        if (err) {
          return next(err)
        }
        if (student.level >= course.level) {
          var reg = {
            $addToSet: {
              student_offering: student.id
            }
          }
          Courses.findOneAndUpdate({ _id: req.params.id }, reg, {}, function (err) {
            if (err) {
              return next(err)
            }
            req.flash('succeed', 'Your Course registration was Successful')
            res.redirect(301, '/studentviewcourse/' + req.params.id)
          })
        } else if (student.level < course.level) {
          req.flash(
            'war',
            'Your level is not eligible to register for this course'
          )
          res.redirect('/studentviewcourse/' + req.params.id)
        }
      })
    } else if (results.score <= 39) {
      Result.findOneAndRemove({
        'course': req.params.id,
        'student': req.session.student.id
      }).exec(function (err) {
        if (err) {
          return next(err)
        }
      })
      Courses.findById(req.params.id).exec((err, course) => {
        if (err) {
          return next(err)
        }
        if (req.session.student.level >= course.level) {
          var reg = {
            $addToSet: {
              student_offering: req.session.student.id
            }
          }
          Courses.findOneAndUpdate({ _id: req.params.id }, reg, {}, function (err) {
            if (err) {
              return next(err)
            }
            req.flash('succeed', 'Your Course registration was Successful and the carryover has been deleted')
            res.redirect(301, '/studentviewcourse/' + req.params.id)
          })
        } else if (student.level < course.level) {
          req.flash(
            'war',
            'Your level is not eligible to register for this course'
          )
          res.redirect('/studentviewcourse/' + req.params.id)
        }
      })
    } else if (results.score > 39) {
      req.flash('succeed', 'You already have a result for this course')
      res.redirect(301, '/studentviewcourse/' + req.params.id)
    }
  })
}

exports.delete_registered_course = function (req, res, next) {
  Courses.findOne({ _id: req.params.id }).exec(function (err, course) {
    if (err) {
      return next(err)
    }
    course.student_offering.filter(student => {
      if (req.session.student.id == student) {
        Courses.findOneAndUpdate({
          _id: req.params.id
        }, {
          $pull: {
            student_offering: student
          }
        },
        function (err) {
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

// GET Student Project Topics
exports.get_project_topics = (req, res, next) => {
  Project.find({}).sort([
    ['updated', 'descending']
  ]).exec((err, topics) => {
    if (err) {
      return next(err)
    }
    res.render('student/project_topics', {
      allowed: req.session.student,
      title: 'Psychology Project Topics',
      projectss: topics,
      helpers: {
        datey: function (data) {
          return moment(data).format('dddd,MMMM Do YYYY')
        }
      }
    })
  })
}

// GET project category
exports.get_project_category = function (req, res, next) {
  Project.find({ 'category': req.params.topic }).sort([
    ['updated', 'descending']
  ]).exec(function (err, topics) {
    if (err) {
      return next(err)
    }
    res.render('student/project_topics', {
      allowed: req.session.student,
      title: 'Psychology Project Topics',
      projectss: topics,
      helpers: {
        datey: function (data) {
          return moment(data).format('dddd,MMMM Do YYYY')
        }
      }
    })
  })
}

// GET Student latest NEWS
exports.get_last_news = (req, res, next) => {
  News.find({})
    .sort([
      ['updated', 'descending']
    ])
    .exec((err, news) => {
      if (err) {
        return next(err)
      }
      res.render('student/student_read_news', {
        allowed: req.session.student,
        title: 'Psychology Latest News',
        newspaper: news,
        helpers: {
          is_equal: function (a, b, opts) {
            if (a === b) {
              return opts.fn(this)
            } else {
              return opts.inverse(this)
            }
          },
          datey: function (user) {
            return moment(user).format('L')
          },
          truncate: function (a, b) {
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
    StudentSigns.find({}, function (err, students) {
      if (err) {
        return next(err)
      }

      res.render('student/fullnews', {
        allowed: req.session.student,
        title: 'Psychology News',
        layout: 'less_layout',
        newspaper: news,
        comments: news.comments,
        commune: function () {
          var answer = []
          students.filter(stud => {
            for (var i = 0; i < news.comments.length; i++) {
              if (news.comments[i].userid === stud.id) {
                let commenter = {
                  userid: stud.id,
                  user: `${stud.surname} ${stud.firstname}`,
                  photo: stud.photo,
                  comment: news.comments[i]

                }
                answer.push(commenter)
              }
            }
          })
          return answer
        },
        decipher: function () {
          var answer = []
          students.filter(hero => {
            for (var i = 0; i < news.likey.length; i++) {
              if (news.likey[i] === hero.id) {
                answer.push(hero)
              }
            }
          })
          return answer
        },
        desliker: function () {
          var answer = []
          students.filter(hero => {
            for (var i = 0; i < news.dislikey.length; i++) {
              if (news.dislikey[i] === hero.id) {
                answer.push(hero)
              }
            }
          })
          return answer
        }
      })
    })
  })
}

// Post Like News
exports.news_like = async (req, res, next) => {
  var look = req.session.student.id

  News.findOneAndUpdate({
    _id: req.params.id
  }, {
    $addToSet: {
      likey: look
    }
  },
  function (err, like) {
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
exports.news_dislike = async (req, res, next) => {
  var look = req.session.student.id

  News.findOneAndUpdate({
    _id: req.params.id
  }, {
    $addToSet: {
      dislikey: look
    }
  },
  function (err, dislike) {
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

// Student Post a comment in a particular news
exports.post_comment_news = (req, res, next) => {
  let user = req.session.student
  let commentor = {
    userid: user.id,
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
      req.io.emit(`${req.params.id}`, commentor)
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
  function (err, cement) {
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
  }).exec(function (err, ion) {
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
    function (err, commet) {
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
  }).exec(function (err, ion) {
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
    function (err, commet) {
      if (err) {
        return next(err)
      }
      res.redirect('/studentgetfullnews/' + commet.id)
    }
    )
  })
}
// -------------------------------------------------------------------------------------------------
// functions for handling everything messages
exports.get_converse = async function (req, res, next) {
  // empty array that holds the final message
  let messages = []
  // function for getting the names of the participants
  let naming = function (norm) {
    let result = []
    StudentSigns.findOne({ '_id': norm }).exec(function (err, stud) {
      if (err) {
        return next(err)
      }
      if (stud) {
        result.push({ name: stud.surname + ' ' + stud.firstname, id: stud.id, photo: stud.photo })
      } else if (!stud) {
        Staff.findOne({ '_id': norm }).exec(function (err, staff) {
          if (err) {
            return next(err)
          }
          if (staff) {
            result.push({ name: staff.surname + ' ' + staff.firstname, id: staff.id, photo: staff.photo })
          }
        })
      }
    })
    return result
  }

  let hole = function (mass) {
    for (let i = 0; i < mass.length; i++) {
      return mass[i]
    }
  }

  let massage = function (iden, chater) {
    Messages.find({ 'conversationId': iden }).sort([['date', 'descending']]).limit(1).exec(function (err, message) {
      if (err) {
        return next(err)
      }
      messages.push({ identity: iden, message: hole(message), details: naming(chater) })
    })
  }

  await Conversation.find({ $or: [{ 'participant1': req.params.id }, { 'participant2': req.params.id }] }).sort([['date', 'descending']]).exec(async (err, conversations) => {
    if (err) {
      return next(err)
    }
    if (!conversations) {
      req.flash('msg', 'No Message')
      res.redirect(301, '/getconverse' + req.params.id)
    } else {
      req.flash('msg', 'Message Available')
      conversations.forEach(function (converse) {
        if (converse.participant1 !== req.params.id) {
          let chatty = converse.participant1
          massage(converse.id, chatty)
        } else if (converse.participant2 !== req.params.id) {
          let chatty = converse.participant2
          massage(converse.id, chatty)
        }
      })
      await res.render('student/conversations', {
        title: 'Messages',
        layout: 'less_layout',
        allowed: req.session.student,
        messagess: function () {
          console.log('Messages Length: ', messages.length)
          return messages.sort(function (a, b) {
            return a.message < b.message
          })
        },
        helpers: {
          truncate: function (a, b) {
            const value = a.toString()
            const limit = b
            var text = ''
            if (value.length > 0) {
              text = text + value.substring(0, limit) + '...'
            }
            return text
          },
          datey: function (data) {
            return calender(data)
          }
        },
        msg: req.flash('msg')
      })
    }
  })
}

// GET messages between two students-------------------------------------------------------
exports.get_messages = function (req, res, next) {
  let naming = function () {
    var stash = { name: '', photo: '' }
    StudentSigns.findOne({ '_id': req.params.recipient }).exec(function (err, stud) {
      if (err) {
        return next(err)
      }
      if (stud) {
        stash.name = stud.surname + ' ' + stud.firstname
        stash.photo = stud.photo.url
      }
    })
    Staff.findOne({ '_id': req.params.recipient }).exec(function (err, staff) {
      if (err) {
        return next(err)
      }
      if (staff) {
        stash.name = staff.surname + ' ' + staff.firstname
        stash.photo = staff.photo.url
      }
    })
    return stash
  }
  // Get conversation id of the messages
  Conversation.findOne({ $or: [{ 'participant1': req.session.student.id, 'participant2': req.params.recipient }, { 'participant1': req.params.recipient, 'participant2': req.session.student.id }] }).select('_id').exec(function (err, conversation) {
    if (err) {
      return next(err)
    } else if (!conversation) {
      res.render('student/messages', {
        title: 'Messages',
        layout: 'less_layout',
        allowed: req.session.student,
        receiver: req.params.recipient
      })
    } else {
      // Get messages linked to a particular id
      Messages.find({ 'conversationId': conversation._id }).exec((err, message) => {
        if (err) {
          return next(err)
        }
        res.render('student/messages', {
          title: 'Messages',
          layout: 'less_layout',
          allowed: req.session.student,
          chats: message,
          receiver: req.params.recipient,
          replyer: naming(),
          helpers: {
            is_equal: function (a, opts) {
              if (a === req.params.recipient) {
                return opts.fn(this)
              } else {
                return opts.inverse(this)
              }
            },
            datey: function (data) {
              return moment(data).format('L')
            }
          }
        })
      })
    }
  })
}

// create a new conversation or add message to an already existing one
exports.new_conversation = function (req, res, next) {
  Conversation.findOne({
    $or: [
      { 'participant1': req.session.student.id, 'participant2': req.params.recipient },
      { 'participant1': req.params.recipient, 'participant2': req.session.student.id }
    ]
  }).select('_id').exec(
    function (err, conversation) {
      if (err) {
        return next(err)
      }
      if (conversation) {
        var reply = new Messages({
          conversationId: conversation._id,
          sender: req.session.student.id,
          body: req.body.message,
          date: new Date(),
          updated: new Date()
        })
        reply.save(function (err) {
          if (err) {
            return next(err)
          }
          res.redirect(301, '/getmessages/' + req.params.recipient)
        })
      } else {
        var newchat = new Conversation({
          participant1: req.session.student.id,
          participant2: req.params.recipient
        })
        newchat.save(function (err, newConversation) {
          if (err) {
            return next(err)
          }
          const message = new Messages({
            conversationId: newConversation._id,
            sender: req.session.student.id,
            body: req.body.message,
            date: new Date(),
            updated: new Date()
          })
          message.save(function (err, newchit) {
            if (err) {
              return next(err)
            }

            res.redirect(301, '/getmessages/' + req.params.recipient)
          })
        })
      }
    })
}

// function for getting the names of every staff
exports.list_staffs = (req, res, next) => {
  Staff.find({}).sort([['updated', 'descending']]).exec((err, staffs) => {
    if (err) {
      return next(err)
    }
    res.render('student/list_staff', {
      allowed: req.session.student,
      title: 'Psychology Lecturers',
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
      coursess: staffs.coursey
    })
  }
  )
}

// to Log-Out Students from the site
exports.logout = (req, res) => {
  if (req.session.student) {
    req.session.destroy()
  }
  res.redirect('/')
}

// working on get conversation
exports.get_conversess = async function (req, res, next) {
  // empty array that holds the final message
  let messages = []

  await Conversation.find({ $or: [{ 'participant1': req.session.student.id }, { 'participant2': req.session.student.id }] }).sort([['date', 'descending']]).exec(async (err, conversations) => {
    if (err) {
      return next(err)
    }
    await conversations.forEach(function (converse) {
      if (converse.participant1 !== req.session.student.id) {
        let chatty = converse.participant1
        massage(converse.id, chatty)
      } else if (converse.participant2 !== req.session.student.id) {
        let chatty = converse.participant2
        massage(converse.id, chatty)
      }
    })
  })

  await res.render('student/conversations', {
    title: 'Messages',
    layout: 'less_layout',
    allowed: req.session.student,
    messagess: function () {
      console.log('Messages Available: ', messages.length)
      return messages.sort(function (a, b) {
        return a.message < b.message
      })
    },
    helpers: {
      truncate: function (a, b) {
        const value = a.toString()
        const limit = b
        var text = ''
        if (value.length > 0) {
          text = text + value.substring(0, limit) + '...'
        }
        return text
      },
      datey: function (data) {
        return calender(data)
      }
    }
  })

  // ----------------------------------------------------------------------------
  let massage = function (iden, chater) {
    Messages.find({ 'conversationId': iden }).sort([['date', 'descending']]).limit(1).exec(function (err, message) {
      if (err) {
        return next(err)
      }
      messages.push({ identity: iden, message: hole(message), details: naming(chater) })
    })
  }

  // function for getting the names of the participants
  let naming = function (norm) {
    let result = []
    StudentSigns.findOne({ '_id': norm }).exec(function (err, stud) {
      if (err) {
        return next(err)
      }
      if (stud) {
        result.push({ name: stud.surname + ' ' + stud.firstname, id: stud.id, photo: stud.photo })
      }
      Staff.findOne({ '_id': norm }).exec(function (err, staff) {
        if (err) {
          return next(err)
        }
        if (staff) {
          result.push({ name: staff.surname + ' ' + staff.firstname, id: staff.id, photo: staff.photo })
        }
      })
    })
    return result
  }

  // ------------------------------------------------------------------
  let hole = function (mass) {
    for (let i = 0; i < mass.length; i++) {
      return mass[i]
    }
  }
}
