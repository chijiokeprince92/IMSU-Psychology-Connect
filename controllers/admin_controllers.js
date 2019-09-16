/* eslint-disable handle-callback-err */
const Admins = require('../models/adminSchema')
const StudentSigns = require('../models/studentSchema')
const Staff = require('../models/staffSchema')
const News = require('../models/newsSchema')
const Project = require('../models/projectSchema')
const Courses = require('../models/coursesSchema')
const Timetable = require('../models/timetableSchema')
const Result = require('../models/resultSchema')
const formidable = require('formidable')
const cloudinary = require('cloudinary')
const async = require('async')
const moment = require('moment')

const {
  body,
  validationResult
} = require('express-validator/check')
const {
  sanitizeBody
} = require('express-validator/filter')

// ------------------------------------------------------------------------------
// ADMIN Functions

// Checking for Admin logins and verifications
exports.admin_session_force = function (req, res, next) {
  if (!req.session.admin) {
    res.redirect('/admin/login')
  } else {
    next()
  }
}

// function for formatting date
var calender = function (user) {
  let day = ''
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month = ''
  if (user.getDay() == 1) {
    day = user.getDay() + 'st'
  }
  if (user.getDay() == 2) {
    day = user.getDay() + 'nd'
  }
  if (user.getDay() == 3) {
    day = user.getDay() + 'rd'
  }
  if (user.getDay() > 3) {
    day = user.getDay() + 'th'
  }
  for (let i = 0; i < months.length; i++) {
    month = months[user.getMonth() - 1]
  }
  return day + ' - ' + month + ' - ' + user.getFullYear()
}
// --------------------------------------------------------------------------

// GET Admin Signup Form
exports.admin_signup_get = function (req, res, next) {
  res.render('admin/admin_signup', {
    title: 'ADMIN_SIGNUP',
    layout: 'less_layout'
  })
}
// ------------------------------------------------------------------------------------

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
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('admin/admin_signup', {
        title: 'Create ADMIN',
        admin: req.body,
        errors: errors.array()
      })
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
      })
      judge.save(function (err) {
        if (err) {
          return next(err)
        }
        // Successful - redirect to ADMIN login page.
        req.flash('message', 'Your signup was successful, Login to have full access')
        res.redirect('/admin/login')
      })
    }
  }
]
// ----------------------------------------------------------------------------------------------

// GET Admin login form
exports.admin_login_get = function (req, res, next) {
  res.render('admin/admin_login', {
    title: 'Admin Login',
    ohno: req.flash('ohno'),
    message: req.flash('message')
  })
}

// POST Admin login form
exports.admin_login_post = function (req, res, next) {
  Admins.findOne({
    'verify': req.body.verify
  }, function (err, sydney) {
    if (err) {
      return next(err)
    } else if (!sydney) {
      req.flash('ohno', 'Your verification_Id is incorrect')
      res.redirect('/admin/login')
    } else if (sydney.password != req.body.password) {
      req.flash('ohno', 'Your password is incorrect')
      res.redirect('/admin/login')
    } else {
      req.session.admin = sydney.id
      req.flash('message', 'Welcome, You are the Admin of this website')
      res.redirect('/admin/hercules')
    }
  })
}

// --------------------------------------------------------------------------
// Display Author update form on GET.
exports.admin_update_get = function (req, res, next) {
  Admins.findById(req.session.admin)
    .exec(function (err, admin) {
      if (err) {
        return next(err)
      }
      // Success.
      res.render('admin/update', {
        title: 'Update Profile',
        admin: req.session.admin,
        admin_info: admin
      })
    })
}

exports.admin_update_post = function (req, res, next) {
  var judge = {
    email: req.body.email,
    surname: req.body.surname,
    firstname: req.body.firstname,
    password: req.body.password
  }
  Admins.findByIdAndUpdate(req.params.id, judge, {}, function (err) {
    if (err) {
      return next(err)
    }
    res.redirect(301, '/admin//profile/' + req.params.id)
  })
}

// ----------------------------------------------------------------------------------------

// GET Admin HOME Page
exports.admin = function (req, res, next) {
  async.parallel({
    didi: function (callback) {
      Admins.findOne({
        '_id': req.session.admin
      }).exec(callback)
    },
    newy: function (callback) {
      News.count().exec(callback)
    }
  }, function (err, name) {
    if (err) {
      return next(err)
    }
    res.render('admin/admin', {
      title: 'Admin Page',
      admin: req.session.admin,
      name: name.didi.surname,
      news: name.newy,
      message: req.flash('message')
    })
  })
}

// GET Profile page for a specific Admin.
exports.profiler = function (req, res, next) {
  Admins.findById(req.params.id)
    .exec(function (err, info) {
      if (err) {
        return next(err)
      }
      // Successful, so render.
      res.render('admin/admin_profile', {
        title: 'Admin Profile',
        layout: 'less_layout',
        admin: req.session.admin,
        admin_info: info
      })
    })
}
// ----------------------------------------------------------------------------------------------

// GET Profile  of a student
exports.view_student_profile = function (req, res, next) {
  StudentSigns.findById(req.params.id)
    .exec(
      function (err, student) {
        if (err) {
          return next(err)
        }
        Courses.find({
          'student_offering': req.params.id
        })
          .exec(function (err, mycourses) {
            if (err) {
              return next(err)
            }
            res.render('admin/view_student', {
              admin: req.session.admin,
              title: 'Student Profile',
              layout: 'less_layout',
              student: student,
              datey: calender(student.date),
              registered_courses: mycourses
            })
          })
      })
}

// Make Course Rep.
exports.student_make_courserep = function (req, res, next) {
  var qualified = {
    is_courserep: req.body.courserep
  }
  StudentSigns.findByIdAndUpdate(req.params.id, qualified, {}, function (err, studentupdate) {
    if (err) {
      return next(err)
    }
    res.redirect('/admin/studentprofile/' + studentupdate.id)
  })
}

// enable a student from having access
exports.enable_student = function (req, res, next) {
  let able = {
    disabled: false
  }
  StudentSigns.findByIdAndUpdate(req.params.id, able, {}, function (err, student) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'The student was successfully Enabled')
    res.redirect('/admin/liststudents/' + req.body.level)
  })
}

// disable a student from having access
exports.disable_student = function (req, res, next) {
  let able = {
    disabled: true
  }
  StudentSigns.findByIdAndUpdate(req.params.id, able, {}, function (err, student) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'The student was successfully Disabled')
    res.redirect('/admin/liststudents/' + req.body.level)
  })
}

// delete student
exports.delete_students = function (req, res, next) {
  StudentSigns.findByIdAndRemove(req.params.id, function (err, stud) {
    if (err) {
      return next(err)
    }
    Result.find({ 'student': stud.id }).exec(function (err, result) {
      if (err) {
        return next(err)
      }
      result.forEach(resul => {
        Result.findOneAndRemove({ 'id': resul.id }).exec(function (err) {
          if (err) {
            return next(err)
          }
        })
      })
    })
    req.flash('message', 'The student was successfully Deleted')
    res.redirect('/admin/studentlist')
  })
}

// working on it in a giffy
exports.delete_student = function (req, res, next) {
  StudentSigns.findById(req.params.id, function (err, stud) {
    if (err) {
      return next(err)
    }
    Result.find({ 'student': stud.id }).exec(function (err, result) {
      if (err) {
        return next(err)
      }
      result.forEach(resul => {
        console.log('Result:', resul)
        Result.findOneAndRemove({ 'id': resul.id }).exec(function (err) {
          if (err) {
            return next(err)
          }
        })
      })
    })
    req.flash('message', 'The student results was successfully Deleted')
    res.redirect('/admin/studentlist')
  })
}

// GET the names of every student in Tabular form
exports.list_students = function (req, res, next) {
  StudentSigns.find({})
    .sort([
      ['level', 'ascending']
    ])
    .exec(
      function (err, student) {
        if (err) {
          return next(err)
        }
        res.render('admin/list_student', {
          admin: req.session.admin,
          title: 'Complete List of Student',
          slow: student,
          levy: 'ALL PSYCHOLOGY STUDENTS',
          message: req.flash('message')
        })
      }
    )
}

// Functions for displaying students by their levels
exports.list_students_level = function (req, res, next) {
  StudentSigns.find({ 'level': req.params.level }).sort([
    ['level', 'ascending']
  ]).exec(function (err, student) {
    if (err) {
      return next(err)
    }
    res.render('admin/list_student', {
      admin: req.session.admin,
      title: `Complete List of ${req.params.level} Student`,
      slow: student,
      levy: `${req.params.level} LEVEL STUDENTS`,
      message: req.flash('message')
    })
  })
}

exports.edit_level_info = function (req, res, next) {
  res.render('admin/edit_level_info', {
    admin: req.session.admin,
    title: 'EDIT LEVEL INFO'
  })
}

// Edit the general informations of each level
exports.edit_100level_info = function (req, res, next) {
  StudentSigns.find({
    'level': req.params.level
  })
    .exec((err, student) => {
      if (err) {
        return next(err)
      }
      res.render('admin/edit_final_info', {
        admin: req.session.admin,
        title: 'EDIT 100 LEVEL INFO',
        message: 'change 100 level',
        student: student
      })
    })
}

// Add a new course to the time table
exports.register_timetable = (req, res) => {
  res.render('admin/reg_timetable', {
    title: 'SELECT THE LEVEL',
    admin: req.session.admin,
    message: req.flash('message')
  })
}

// GET the level to adjust its the time table
exports.register_timetable_post = (req, res, next) => {
  Courses.find({
    'level': req.body.level
  }).exec((err, course) => {
    if (err) {
      return next(err)
    }
    res.render('admin/add_timetable', {
      title: 'Add Time Table',
      layout: 'less_layout',
      admin: req.session.admin,
      course: course,
      level: req.body.level
    })
  })
}

// POST student time table for a particular level
exports.post_time_table = (req, res, next) => {
  var timetable = new Timetable({
    level: req.body.level,
    day: req.body.day,
    time: req.body.time,
    course: req.body.course
  })
  timetable.save((err) => {
    if (err) {
      return next(err)
    }
    req.flash('message', `The Course was successfully uploaded`)
    res.redirect('/admin/regtimetable')
  })
}

// ..........................................................................................................
// function for getting the names of every staff
exports.list_staffs = function (req, res, next) {
  Staff.find({})
    .exec(function (err, staffs) {
      if (err) {
        return next(err)
      }
      res.render('admin/list_staff', {
        admin: req.session.admin,
        title: 'Complete List of Staffs',
        slow: staffs,
        message: req.flash('message')
      })
    })
}

// GET Profile of a Particular Staff
exports.view_staff_profile = function (req, res, next) {
  async.parallel({
    coursey: function (callback) {
      Courses.find({
        'lecturer': req.params.id
      }).exec(callback)
    },
    staffy: function (callback) {
      Staff.findById(req.params.id).exec(callback)
    }
  }, function (err, staff) {
    if (err) {
      return next(err)
    }
    res.render('admin/view_staffs', {
      admin: req.session.admin,
      title: 'Staff Profile',
      layout: 'less_layout',
      staff: staff.staffy,
      coursess: staff.coursey
    })
  })
}

// enable a staff from having access
exports.enable_staff = function (req, res, next) {
  let able = {
    disabled: false
  }
  Staff.findByIdAndUpdate(req.params.id, able, {}, function (err, staff) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'The staff was successfully Enabled')
    res.redirect('/admin/stafflist')
  })
}

// disable a staff from having access
exports.disable_staff = function (req, res, next) {
  let able = {
    disabled: true
  }
  Staff.findByIdAndUpdate(req.params.id, able, {}, function (err, staff) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'The staff was successfully Disabled')
    res.redirect('/admin/stafflist')
  })
}

exports.delete_staff = function (req, res, next) {
  Staff.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'The staff was successfully deleted')
    res.redirect('/admin/stafflist')
  })
}

// ---------------------------------------------------------------------------------------------

// GET form for Project Upload
exports.get_upload_project = function (req, res, next) {
  res.render('admin/upload_project', {
    title: 'Upload Project Topic',
    layout: 'less_layout',
    admin: req.session.admin
  })
}

// POST form for Project Upload
exports.post_upload_project = function (req, res, next) {
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      return err
    }
    if (!files.project.name.match(/\.(pdf)$/i)) {
      console.log('This file is not a PDF')
      req.flash('message', 'The file is not a PDF file')
      res.redirect(301, '/admin/getprojecttopicss')
    } else {
      cloudinary.v2.uploader.upload(files.project.path, function (err, result) {
        if (err) {
          return next(err)
        }
        // add cloudinary url for the image to the topic object under image property
        var project = new Project({
          project: {
            url: result.secure_url,
            public_id: result.public_id
          },
          topic: fields.topic,
          description: fields.description,
          category: fields.category,
          created: new Date(),
          updated: new Date()
        })
        project.save(function (err) {
          if (err) {
            return next(err)
          }
          req.flash('message', 'The project was successfully added')
          res.redirect(301, '/admin/getprojecttopicss')
        })
      })
    }
  })
}

// GET PROJECT Topics
exports.get_project_topics = function (req, res, next) {
  Project.find({}).sort([
    ['updated', 'descending']
  ]).exec(function (err, project) {
    if (err) {
      return next(err)
    }
    res.render('admin/project_topics', {
      admin: req.session.admin,
      layout: 'less_layout',
      title: 'Psychology Project Topics',
      projectss: project,
      message: req.flash('message'),
      helpers: {
        datey: function (data) {
          return moment(data).format('dddd,MMMM Do YYYY')
        }
      }
    })
  })
}

// GET project topics by category
exports.get_project_category = function (req, res, next) {
  Project.find({ 'category': req.params.topic }).sort([
    ['updated', 'descending']
  ]).exec(function (err, project) {
    if (err) {
      return next(err)
    }
    res.render('admin/project_topics', {
      admin: req.session.admin,
      layout: 'less_layout',
      title: 'Psychology Project Topics',
      projectss: project,
      helpers: {
        datey: function (data) {
          return moment(data).format('dddd,MMMM Do YYYY')
        }
      }
    })
  })
}

// GET form to edit project
exports.edit_project_get = function (req, res, next) {
  Project.findById(req.params.id, function (err, project) {
    if (err) {
      return next(err)
    }
    res.render('admin/edit_project', {
      admin: req.session.admin,
      layout: 'less_layout',
      title: 'Edit Project Topic',
      projectss: project
    })
  })
}

// POST form to edit project
exports.edit_project_post = function (req, res, next) {
  var project = {
    topic: req.body.topic,
    description: req.body.description,
    category: req.body.category,
    updated: new Date()
  }
  Project.findByIdAndUpdate(req.params.id, project, {}, function (err) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'Project was successfully edited')
    res.redirect('/admin/getprojecttopicss')
  })
}

// Delete project topic
exports.delete_project = function (req, res, next) {
  Project.findByIdAndRemove(req.params.id, function (err, delProject) {
    if (err) {
      return next(err)
    }
    cloudinary.v2.uploader.destroy(delProject.project.public_id, function (err, result) {
      if (err) {
        return next(err)
      }
    })
    res.redirect('/admin/getprojecttopicss')
  })
}

// --------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// GET form for NEWS upload
exports.get_upload_news = function (req, res, next) {
  res.render('admin/admin_get_news', {
    title: 'Admin Upload Projects',
    layout: 'less_layout',
    admin: req.session.admin
  })
}

// POST form for NEWS upload
exports.post_upload_news = function (req, res, next) {
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    console.log(fields.heading, files.image.name)
    if (err) {
      return err
    }
    if (!files.image.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      req.flash('message', 'The file is not a picture')
      res.redirect(301, '/admin/getlastnews')
    } else {
      cloudinary.v2.uploader.upload(files.image.path, function (err, result) {
        if (err) {
          return next(err)
        }
        // add cloudinary url for the image to the topic object under image property
        var latest = new News({
          picture: {
            url: result.secure_url,
            public_id: result.public_id
          },
          heading: fields.heading,
          passage: fields.passage,
          passage1: fields.passage1,
          passage2: fields.passage2,
          created: new Date(),
          updated: new Date()
        })
        latest.save(function (err) {
          if (err) {
            return next(err)
          }
          req.flash('message', 'The news was successfully Added')
          res.redirect(301, '/admin/getlastnews')
        })
      })
    }
  })
}

// GET form for news edit
exports.news_edit_get = function (req, res, next) {
  News.findOne({
    '_id': req.params.id
  }, function (err, news) {
    if (err) {
      return next(err)
    }
    res.render('admin/edit_news', {
      admin: req.session.admin,
      layout: 'less_layout',
      title: 'EDIT NEWS',
      newy: news
    })
  })
}

// POST form for news upload
exports.news_edit_post = function (req, res, next) {
  var latest = {
    heading: req.body.heading,
    passage: req.body.passage,
    passage1: req.body.passage1,
    passage2: req.body.passage2,
    updated: new Date()
  }
  News.findByIdAndUpdate(req.params.id, latest, {}, function (err, newsupdate) {
    if (err) {
      return next(err)
    }
    req.flash('message', 'This news was successfully edited')
    res.redirect(newsupdate.adminurl)
  })
}

// GET latest NEWS
exports.get_last_news = function (req, res, next) {
  News.find({}).sort([
    ['updated', 'descending']
  ]).exec(function (err, news) {
    if (err) {
      return next(err)
    }
    res.render('admin/admin_news', {
      admin: req.session.admin,
      title: 'Psychology News',
      layout: 'less_layout',
      newspaper: news,
      message: req.flash('message'),
      helpers: {
        datey: function (data) {
          return moment(data).format('L')
        }
      }
    })
  })
}

// GET full NEWS
exports.get_full_news = function (req, res, next) {
  News.findOne({
    '_id': req.params.id
  }, function (err, news) {
    if (err) {
      return next(err)
    }
    StudentSigns.find({}, function (err, students) {
      if (err) {
        return next(err)
      }
      res.render('admin/fullnews', {
        admin: req.session.admin,
        layout: 'less_layout',
        title: 'Psychology Full News',
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
        },
        message: req.flash('message')
      })
    })
  })
}

// Delete news by admin
exports.delete_news = function (req, res, next) {
  News.findByIdAndRemove(req.params.id, function (err, delnews) {
    if (err) {
      return next(err)
    }
    cloudinary.v2.uploader.destroy(delnews.photo.public_id, function (err) {
      if (err) {
        return next(err)
      }
    })
  })
  res.redirect('/admin/getlastnews')
}

// ----------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// GET course registration
exports.add_courses = function (req, res, next) {
  Staff.find({}, function (err, teacher) {
    if (err) {
      return next(err)
    }
    res.render('admin/add_courses', {
      title: 'Add Courses',
      layout: 'less_layout',
      admin: req.session.admin,
      teacher: teacher
    })
  })
}

// POST Course Registration
exports.post_course = function (req, res, next) {
  var course = new Courses({
    coursecode: req.body.coursecode,
    coursetitle: req.body.coursetitle,
    level: req.body.level,
    semester: req.body.semester,
    units: req.body.units,
    borrowed: req.body.borrowed
  })
  course.save(function (err, coursed) {
    if (err) {
      return next(err)
    }
    res.redirect(302, '/admin/viewcourse/' + coursed.id)
  })
}

// GET course form for edit.
exports.course_update_get = function (req, res, next) {
  async.parallel({
    coursess: function (callback) {
      Courses.findById(req.params.id)
        .exec(callback)
    }

  }, function (err, coursey) {
    if (err) {
      return next(err)
    }
    // Success.
    res.render('admin/edit_course', {
      title: 'Update Course_Outline',
      layout: 'less_layout',
      admin: req.session.admin,
      coursey: coursey.coursess
    })
  })
}

// POST course form for edit
exports.course_update_post = function (req, res, next) {
  var course = {
    coursecode: req.body.coursecode,
    coursetitle: req.body.coursetitle,
    level: req.body.level,
    semester: req.body.semester,
    units: req.body.units,
    borrowed: req.body.borrowed
  }
  Courses.findByIdAndUpdate(req.params.id, course, {}, function (err, courseupdate) {
    if (err) {
      return next(err)
    }
    res.redirect(301, '/admin/getcourses/' + courseupdate.level)
  })
}

// Delete course
exports.delete_course = function (req, res, next) {
  Courses.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err)
    }
    res.redirect(301, '/admin/getcourses/100')
  })
}

// ---------------------------------------------------------------------------------------------------------------------------
// GET List of Various Courses in a particular level...
exports.get_courses_level = function (req, res, next) {
  async.parallel({
    first_semester: function (callback) {
      Courses.find({
        'level': req.params.level,
        'semester': 1,
        'borrowed': 'no'
      }).exec(callback)
    },
    first_semester_borrowed: function (callback) {
      Courses.find({
        'level': req.params.level,
        'semester': 1,
        'borrowed': 'yes'
      }).exec(callback)
    },
    second_semester: function (callback) {
      Courses.find({
        'level': req.params.level,
        'semester': 2,
        'borrowed': 'no'
      }).exec(callback)
    },
    second_semester_borrowed: function (callback) {
      Courses.find({
        'level': req.params.level,
        'semester': 2,
        'borrowed': 'yes'
      }).exec(callback)
    }
  }, function (err, hundred) {
    if (err) {
      return next(err)
    }
    if (hundred.first_semester == null) {
      res.redirect('/')
    }
    res.render('admin/list_courses', {
      title: '100 Level Courses',
      layout: 'less_layout',
      admin: req.session.admin,
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
  })
}

// GET detailed Page for a particular course
exports.view_course = function (req, res, next) {
  Courses.findById(req.params.id)
    .exec(function (err, course) {
      if (err) {
        return next(err)
      }
      Staff.find({})
        .exec(function (err, staff) {
          if (err) {
            return next(err)
          }
          StudentSigns.find({}).sort([
            ['level', 'ascending']
          ]).exec((err, students) => {
            if (err) {
              return next(err)
            }
            res.render('admin/view_course', {
              title: 'Psychology Course',
              layout: 'less_layout',
              admin: req.session.admin,
              course: course,
              teacher: staff,
              message: req.flash('delete'),
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

exports.edit_course_lecturer = function (req, res, next) {
  var staffy = req.body.lecturee
  Courses.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      lecturer: staffy
    }
  }, function (err) {
    if (err) {
      return next(err)
    }
    req.flash('delete', 'The Lecturer was successfully added')
    res.redirect('/admin/viewcourse/' + req.params.id)
  })
}

exports.delete_course_lecturer = function (req, res, next) {
  Courses.findOneAndUpdate({
    '_id': req.params.id
  }, {
    $pull: {
      'lecturer': req.body.lect
    }
  },
  function (err) {
    if (err) {
      return next(err)
    }
    req.flash('delete', 'The lecturer was successfully deleted')
    res.redirect('/admin/viewcourse/' + req.params.id)
  })
}

// GET Student Result Filler form
exports.student_addresult_get = function (req, res, next) {
  Courses.findOne({
    '_id': req.params.id
  }).exec(function (err, course) {
    if (err) {
      return next(err)
    }
    // find students who registered for this course
    StudentSigns.find({
      '_id': course.student_offering
    }).exec(function (err, students) {
      if (err) {
        return next(err)
      }
      // find all students whose results have been uploaded that registered for this course
      Result.find({
        'course': course.id,
        'student': course.student_offering
      }).exec(function (err, results) {
        if (err) {
          return next(err)
        }
        res.render('admin/student_result_form', {
          title: 'Add Student Result',
          layout: 'less_layout',
          admin: req.session.admin,
          courses: course,
          students: students,
          results: results,
          message: req.flash('message'),
          accept: function () {
            var filled = []
            students.forEach(element => {
              results.filter(function (resul) {
                if (element.id == resul.student) {
                  var jesus = {
                    name: `${element.surname} ${element.firstname}`,
                    matnumber: element.matnumber,
                    grade: resul.grade,
                    result_id: resul.id
                  }
                  filled.push(jesus)
                }
              })
            })
            return filled
          }
        })
      })
    })
  })
}

exports.student_addresults_post = function (req, res, next) {
  // function for calculating the grade
  var grader = function (a) {
    let grade = ''
    if (a >= 70 && a <= 100) {
      grade = 'A'
    } else if (a >= 60 && a <= 69) {
      grade = 'B'
    } else if (a >= 50 && a <= 59) {
      grade = 'C'
    } else if (a >= 45 && a <= 49) {
      grade = 'D'
    } else if (a >= 40 && a <= 44) {
      grade = 'E'
    } else if (a >= 0 && a <= 39) {
      grade = 'F'
    }
    return grade
  }

  var resulty = new Result({
    course: req.body.course,
    student: req.body.student,
    score: req.body.score,
    grade: grader(req.body.score)
  })
  resulty.save(function (err) {
    if (err) {
      return next(err)
    }
    Courses.findOneAndUpdate({
      _id: req.params.id
    }, {
      $pull: {
        student_offering: req.body.student
      }
    }, function (err) {
      if (err) {
        return next(err)
      }
    })
    req.flash('message', 'The result was successfully saved')
    res.redirect('/admin/studentaddresult/' + req.params.id)
  })
}

exports.view_all_results = function (req, res, next) {
  Result.find({})
    .exec(function (err, result) {
      if (err) {
        return next(err)
      }
      res.render('admin/view_all_results', {
        title: 'ALL STUDENTS RESULTS',
        admin: req.session.admin,
        result: result
      })
    })
}

// function for deleting a single student result from the list of students offering a course
exports.delete_result = function (req, res, next) {
  StudentSigns.findOne({ 'id': req.params.stud }).exec(function (err, student) {
    if (err) {
      return next(err)
    }
    Result.findByIdAndRemove({
      '_id': req.params.id
    }).exec(function (err) {
      if (err) {
        return next(err)
      }
      res.redirect('/admin/studentfullresults/' + req.params.stud)
    })
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
              id: read.id,
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

  // function for finding a particular student and calculating their result
  StudentSigns.findOne({
    _id: req.params.id
  }).exec((err, stud) => {
    if (err) {
      return next(err)
    }

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
        res.render('admin/view_result', {
          title: 'Personal Result',
          layout: 'less_layout',
          admin: req.session.admin,
          stud: stud,
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
  })
}

// staff signup GET
exports.staff_signup_get = function (req, res, next) {
  res.render('admin/staff_signup', {
    title: 'STAFF SIGNUP',
    layout: 'less_layout',
    admin: req.session.admin
  })
}

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
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('/admin/staff_signup', {
        title: 'Create Staff',
        staff: req.body,
        errors: errors.array()
      })
    } else {
      // Data from form is valid.
      // Create a Staff object with escaped and trimmed data.
      var staffRegister = new Staff({
        email: req.body.email,
        surname: req.body.surname,
        firstname: req.body.firstname,
        staff_id: req.body.staff_id,
        gender: req.body.gender,
        phone: req.body.phone,
        bio: req.body.bio,
        password: req.body.password
      })
      staffRegister.save(function (err) {
        if (err) {
          return next(err)
        }
        // Successful - redirect to Staff login page.
        res.redirect(staffRegister.urly)
      })
    }
  }
]

// ADMIN Logout Request
exports.admin_logout = (req, res) => {
  if (req.session.admin) {
    req.session.destroy()
  }
  res.redirect('/')
}
