// This Codes is for calculating students results
// ------------------------------------------------------------------------------

var user = []

function addresult () {
  var user = this.user
  var grades = ['A', 'B', 'C', 'D', 'E', 'F']
  var courses = document.getElementById('courses').value
  var scores = document.getElementById('scores').value
  // for calculating the precise GRADE
  function grade () {
    if (scores <= 39) {
      return grades[5]
    } else if (scores > 39 && scores <= 44) {
      return grades[4]
    } else if (scores > 44 && scores <= 49) {
      return grades[3]
    } else if (scores > 49 && scores <= 59) {
      return grades[2]
    } else if (scores > 59 && scores <= 69) {
      return grades[1]
    } else if (scores > 69 && scores <= 100) {
      return grades[0]
    } else {

    }
  };
  for (var i = 0; i < user.length; i++) {
    if (user[i][0] == courses) {
      alert("You've added " + user[i][0] + ' before')
      return
    }
    if (scores > 100) {
      alert('The score should NOT be higher than 100')
      return
    }
    if (!Number(scores)) {
      alert('The score is not a number')
      return
    }
  }

  this.user.push([courses, scores, grade()])
  return document.getElementById('compute').innerHTML = user
}

// ------------------------------------------------------------------------------
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/upload')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({
  storage: storage
})

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
        return next(err)
      } else if (!swagger) {
        res.redirect('/')
      } else if (swagger.student) {
        res.render('admin/list_student', {
          admin: req.session.admin,
          title: 'Complete List of Student',
          message: 'Complete List of Students',
          slow: swagger,
          identify: swagger._id,
          email: swagger.email,
          surname: swagger.surname,
          firstname: swagger.firstname,
          matnumber: swagger.matnumber,
          level: swagger.level,
          gender: swagger.gender,
          phone: swagger.phone
        })
      }
    }
  })
}

var glory = {
  monday: [{ course: 'PSY432', time: 'monday', day: '2', level: '400' }],
  tuesday: [{ course: 'SOC103', time: 'tuesday', day: '8', level: '100' },
    { course: 'SOC103', time: 'tuesday', day: '12', level: '100' },
    { course: 'PSY441', time: 'tuesday', day: '12', level: '400' },
    { course: 'PSY445', time: 'tuesday', day: '2', level: '400' }
  ],
  wednesday: [{ course: 'PSY432', time: 'wednesday', day: '2', level: '400' }],
  thursday: [{ course: 'SOC103', time: 'thursday', day: '10', level: '100' },
    { course: 'SOC103', time: 'thursday', day: '12', level: '100' },
    { course: 'PSY441', time: 'thursday', day: '2', level: '400' }
  ],
  friday: [{ course: 'PSY445', time: 'friday', day: '8', level: '400' },
    { course: 'PSY432', time: 'friday', day: '2', level: '400' }
  ]
}

function friday (obj) {
  var arr = []
  var len = Object.keys(obj).length
  for (var ele in obj) {
    for (var i = 0; i < ele.length; i++) {
      arr.push(ele.course[i])
    }
  }
  return arr
}

function isEqual (a, b) {
  var arr = []
  a.filter((thor) => {
    if (thor == b) {
      arr.push(thor)
    } else {

    }
  })
  return arr
}

function isEquate (a, b) {
  var arr = []
  a.filter((thor) => {
    if (thor.time == b) {
      arr.push(thor)
    } else {

    }
  })
  return arr
}

function abba (a) {
  var arr = Array(4).fill('free')
  for (var i = 0; i < a.length; i++) {
    if (a[i].time == '8') {
      arr[0] = a[i].course
    }
    if (a[i].time == '10') {
      arr[1] = a[i].course
    }
    if (a[i].time == '12') {
      arr[2] = a[i].course
    }
    if (a[i].time == '2') {
      arr[3] = a[i].course
    }
  }
  return arr
}
