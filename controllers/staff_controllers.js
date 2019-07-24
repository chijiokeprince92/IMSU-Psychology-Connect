// This is the function for handling anything Staff

const Staff = require('../models/staffSchema')
const StudentSigns = require('../models/studentSchema')
const Messages = require('../models/messageSchema')
const Conversation = require('../models/conversationSchema')
const News = require('../models/newsSchema')
const Project = require('../models/projectSchema')
const Result = require('../models/resultSchema')
const Courses = require('../models/coursesSchema')
const Timetable = require('../models/timetableSchema')
const formidable = require('formidable')
const cloudinary = require('cloudinary')
const moment = require('moment')
var async = require('async')

// --------------------------------------------------------------------------------------------

exports.staffloginRequired = function (req, res, next) {
  if (!req.session.staff) {
    res.redirect('/staff/login')
  } else {
    return next()
  }
}
// ----------------------------------------------------------------------------------

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
  }, (err, staffy) => {
    if (err) {
      return next(err)
    } else if (!staffy) {
      req.flash('ohno', 'Your staff_Id is incorrect')
      res.redirect(302, '/staff/login')
    } else if (staffy.password !== req.body.password) {
      // password is incorrect
      req.flash('ohno', 'Your Password is incorrect')
      res.redirect(302, '/staff/login')
    } else {
      req.session.staff = {
        id: staffy.id,
        photo: staffy.photo.url || '/images/psylogo4.jpg'
      }
      req.flash('message', `Welcome ${staffy.surname}, You are logged in`)
      res.redirect(302, '/staff/staffhome')
    }
  })
}

exports.staff_home = (req, res, next) => {
  async.parallel({
    didi: (callback) => {
      Staff.findOne({
        '_id': req.session.staff.id
      }).exec(callback)
    },
    newy: (callback) => {
      News.countDocuments().exec(callback)
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

// Display profile for a specific Staff.
exports.staff_profiler = function (req, res, next) {
  async.parallel({
    course: function (callback) {
      Courses.find({
        'lecturer': req.session.staff.id
      }).exec(callback)
    },
    staff: function (callback) {
      Staff.findById(req.session.staff.id)
        .exec(callback)
    }
  }, (err, profile) => {
    if (err) {
      return next(err)
    } // Error in API usage.
    // Successful, so render.
    res.render('staffs/staff_profiler', {
      title: 'Staff Profile',
      layout: 'less_layout',
      staff_session: req.session.staff,
      staff: profile.staff,
      coursess: profile.course,
      message: req.flash('message'),
      helpers: {
        datey: function (data) {
          return moment(data).format('dddd,MMMM Do YYYY')
        }
      }
    })
  })
}

// Display Author update form on GET.
exports.staff_update_get = (req, res, next) => {
  Staff.findById(req.session.staff.id, function (err, staff) {
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
  var updatedStaff = {
    email: req.body.email,
    surname: req.body.surname,
    firstname: req.body.firstname,
    phone: req.body.phone,
    bio: req.body.bio,
    staff_id: req.body.staff_id,
    updated: new Date(),
    password: req.body.password
  }
  Staff.findByIdAndUpdate(req.session.staff.id, updatedStaff, {}, function (err, staffupdate) {
    if (err) {
      return next(err)
    }
    res.redirect(staffupdate.url)
  })
}

exports.staff_update_pics = async (req, res, next) => {
  Staff.findById(req.session.staff.id).exec(function (err, stud) {
    if (err) {
      return next(err)
    }
    var form = new formidable.IncomingForm()
    form.parse(req)
    form.on('file', function (name, file) {
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        console.log('The file is not a picture')
        req.flash('message', 'The file you uploaded was not a picture')
        res.redirect(301, '/staff/profile' + req.session.staff.id)
      } else {
        console.log('The file is a picture')
        if (stud.photo.url === undefined) {
          // add a new image to student profile
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
            Staff.findByIdAndUpdate(req.session.staff.id, qualified, {},
              (err, staffupdate) => {
                if (err) {
                  return next(err)
                }
                res.redirect(staffupdate.url)
              })
          })
        } else {
          // delete the current profile image from cloudinary
          cloudinary.v2.uploader.destroy(stud.photo.public_id, function (err) {
            if (err) {
              return next(err)
            }
          })
          // upload the new image in replacement of the deleted one
          cloudinary.v2.uploader.upload(file.path, function (err, pics) {
            if (err) {
              return next(err)
            }
            // add cloudinary url for the image to the topic object under image property
            var qualified = {
              photo: {
                url: pics.secure_url,
                public_id: pics.public_id
              }
            }
            Staff.findByIdAndUpdate(req.session.staff.id, qualified, {},
              (err, staffupdate) => {
                if (err) {
                  return next(err)
                }
                res.redirect(staffupdate.url)
              })
          })
        }
      }
    })
  })
}

// ---------------------------------------------------------------------------------------------
// function for getting the names of every staff
exports.list_staffs = function (req, res, next) {
  Staff.find({}).sort([['updated', 'descending']])
    .exec(function (err, staff) {
      if (err) {
        return next(err)
      }
      res.render('staffs/list_staffs', {
        staff_session: req.session.staff,
        title: 'Psychology Staffs',
        slow: staff,
        helpers: {
          isEqual: function (a, opts) {
            if (a == req.session.staff.id) {
              return opts.fn(this)
            } else {
              return opts.inverse(this)
            }
          }
        }
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
    res.render('staffs/view_staffss', {
      staff_session: req.session.staff,
      title: 'Staff Profile',
      layout: 'less_layout',
      staff: staff.staffy,
      coursess: staff.coursey,
      helpers: {
        datey: function (data) {
          return moment(data).format('dddd,MMMM Do YYYY')
        }
      }
    })
  })
}

exports.get_schedule = function (req, res, next) {
  var timer = function (coursey, time, day) {
    var identity = []
    var chosen = []
    coursey.forEach(elem => {
      identity.push(elem.coursecode)
    })
    time.filter((tick) => {
      for (var i = 0; i < identity.length; i++) {
        if (identity[i] == tick.course) {
          if (tick.day == `${day}`) {
            chosen.push({
              course: tick.course,
              day: tick.day,
              time: tick.time,
              level: tick.level
            })
          }
        }
      }
    })
    return chosen
  }
  // find and render the timetables for a lecturer
  Courses.find({ 'lecturer': req.session.staff.id }, function (err, success) {
    if (err) {
      return next(err)
    }
    Timetable.find({}, function (err, time) {
      if (err) {
        return next(err)
      }
      res.render('staffs/schedule', {
        title: 'Staff Schedule',
        staff_session: req.session.staff,
        courses: success,
        monday: timer(success, time, 'monday'),
        tuesday: timer(success, time, 'tuesday'),
        wednesday: timer(success, time, 'wednesday'),
        thursday: timer(success, time, 'thursday'),
        friday: timer(success, time, 'friday'),
        helpers: {
          datey: function (a) {
            if (a == 8 || a == 10) {
              return `${a}:00AM`
            } else {
              return `${a}:00PM`
            }
          }
        }
      })
    })
  })
}

// GET Profile  of a student
exports.view_student_profile = function (req, res, next) {
  StudentSigns.findById(req.params.id)
    .exec(function (err, student) {
      if (err) {
        return next(err)
      }
      Courses.find({ 'student_offering': req.params.id })
        .exec(function (err, mycourses) {
          if (err) {
            return next(err)
          }
          res.render('staffs/view_students', {
            staff_session: req.session.staff,
            title: 'Student Profile',
            layout: 'less_layout',
            students: student,
            registered_courses: mycourses,
            helpers: {
              datey: function (data) {
                return moment(data).format('dddd,MMMM Do YYYY')
              }
            }
          })
        })
    }
    )
}

// GET the names of every student in Tabular form
exports.list_students = function (req, res, next) {
  StudentSigns.find({})
    .sort([
      ['level', 'ascending'], ['updated', 'descending']
    ])
    .exec(
      function (err, student) {
        if (err) {
          return next(err)
        }
        res.render('staffs/list_student', {
          staff_session: req.session.staff,
          title: 'Complete List of Student',
          slow: student,
          heading: 'ALL PSYCHOLOGY STUDENTS'
        })
      }
    )
}

// Functions for displaying students by their levels
exports.list_students_level = function (req, res, next) {
  StudentSigns.find({
    'level': req.params.level
  }).sort([['updated', 'descending']
  ]).exec(function (err, student) {
    if (err) {
      return next(err)
    }
    res.render('staffs/list_student', {
      staff_session: req.session.staff,
      title: `Complete List of ${req.params.level} Student`,
      slow: student,
      heading: `${req.params.level} LEVEL STUDENTS`
    })
  })
}

// function for checking students results
exports.student_result = (req, res, next) => {
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

  // find result of a particular student
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
      res.render('staffs/view_result', {
        title: 'Student Result',
        layout: 'less_layout',
        staff_session: req.session.staff,
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
    res.render('staffs/list_courses', {
      title: `${req.params.level} Level Courses`,
      layout: 'less_layout',
      staff_session: req.session.staff,
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
exports.view_courses = function (req, res, next) {
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
          StudentSigns.find({}).exec((err, students) => {
            if (err) {
              return next(err)
            }
            res.render('staffs/view_courses', {
              title: 'Psychology Course',
              staff_session: req.session.staff,
              course: course,
              teacher: staff,
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

exports.add_courseoutline = function (req, res, next) {
  var course = {
    $addToSet: {
      courseoutliner: {
        outline: req.body.courseoutline,
        changed_by: req.session.staff.id
      }
    }
  }
  Courses.findByIdAndUpdate(req.params.id, course, {}, function (err, courseupdate) {
    if (err) {
      return next(err)
    }
    res.redirect(courseupdate.lect)
  })
}

exports.edit_courseoutline = function (req, res, next) {
  var course = {
    outline: req.body.courseoutline,
    changed_by: req.session.staff.id
  }
  Courses.findByIdAndUpdate(req.params.id, course, {}, function (err, courseupdate) {
    if (err) {
      return next(err)
    }
    res.redirect(courseupdate.lect)
  })
}

// GET Admin latest NEWS
exports.get_last_news = function (req, res, next) {
  News.find({}).sort([
    ['updated', 'descending']
  ]).exec(function (err, release) {
    if (err) {
      return next(err)
    }
    res.render('staffs/staff_read_news', {
      staff_session: req.session.staff,
      title: 'Psychology News',
      newspaper: release,
      helpers: {
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

// GET Admin full NEWS
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
      res.render('staffs/fullnews', {
        staff_session: req.session.staff,
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
          students.filter(stud => {
            for (var i = 0; i < news.likey.length; i++) {
              if (news.likey[i] === stud.id) {
                answer.push(stud)
              }
            }
          })
          return answer
        },
        desliker: function () {
          var answer = []
          students.filter(stud => {
            for (var i = 0; i < news.dislikey.length; i++) {
              if (news.dislikey[i] === stud.id) {
                answer.push(stud)
              }
            }
          })
          return answer
        }
      })
    })
  })
}

// GET Staff PROJECT Topics
exports.get_project_topics = function (req, res, next) {
  Project.find({}).sort([
    ['updated', 'descending']
  ]).exec(function (err, release) {
    if (err) {
      return next(err)
    }
    res.render('staffs/project_topics', {
      staff_session: req.session.staff,
      title: 'Psychology Project Topics',
      projectss: release,
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
    res.render('staffs/project_topics', {
      staff_session: req.session.staff,
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

exports.get_conversations = function (req, res, next) {
  let messages = []
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

  Conversation.find({ $or: [{ 'participant1': req.session.staff.id }, { 'participant2': req.session.staff.id }] }).sort([['date', 'descending']]).exec((err, conversations) => {
    if (err) {
      return next(err)
    }
    conversations.forEach(function (converse) {
      if (converse.participant1 !== req.session.staff.id) {
        let chatty = converse.participant1
        massage(converse.id, chatty)
      } else if (converse.participant2 !== req.session.staff.id) {
        let chatty = converse.participant2
        massage(converse.id, chatty)
      }
    })
    res.render('staffs/conversations', {
      title: 'Messages',
      layout: 'less_layout',
      staff_session: req.session.staff,
      messagess: function () {
        return messages.sort(function (a, b) {
          return a.message < b.message
        })
      }
    })
  })
}

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

  Conversation.findOne({
    $or: [
      { 'participant1': req.session.staff.id, 'participant2': req.params.recipient },
      { 'participant1': req.params.recipient, 'participant2': req.session.staff.id }
    ]
  }).select('_id').exec(function (err, conversation) {
    if (err) {
      return next(err)
    } else if (!conversation) {
      res.render('staffs/messages', {
        title: 'Messages',
        layout: 'less_layout',
        staff_session: req.session.staff,
        receiver: req.params.recipient
      })
    } else {
      Messages.find({
        'conversationId': conversation._id
      }).exec((err, message) => {
        if (err) {
          return next(err)
        }
        res.render('staffs/messages', {
          title: 'Messages',
          layout: 'less_layout',
          staff_session: req.session.staff,
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
            }
          }
        })
      })
    }
  })
}

// correct
exports.new_conversation = function (req, res, next) {
  Conversation.findOne({
    $or: [
      { 'participant1': req.session.staff, 'participant2': req.params.recipient },
      { 'participant1': req.params.recipient, 'participant2': req.session.staff }
    ]
  }).select('_id').exec(
    function (err, conversation) {
      if (err) {
        return next(err)
      }
      if (conversation) {
        var reply = new Messages({
          conversationId: conversation._id,
          sender: req.session.staff,
          body: req.body.message,
          date: Date()
        })
        reply.save(function (err) {
          if (err) {
            return next(err)
          }
          res.redirect(301, '/staff/getmessages/' + req.params.recipient)
        })
      } else {
        var newchat = new Conversation({
          participant1: req.session.staff,
          participant2: req.params.recipient
        })
        newchat.save(function (err, newConversation) {
          if (err) {
            return next(err)
          }
          const message = new Messages({
            conversationId: newConversation._id,
            sender: req.session.staff,
            body: req.body.message,
            date: Date()
          })
          message.save(function (err) {
            if (err) {
              return next(err)
            }

            res.redirect(301, '/staff/getmessages/' + req.params.recipient)
          })
        })
      }
    })
}

// to Log-Out Staffs from the site
exports.staff_logout = function (req, res) {
  if (req.session.staff) {
    req.session.destroy()
  }
  res.redirect('/')
}
