const News = require('../models/newsSchema')
var StudentSigns = require('../models/studentSchema')
const Test = require('../models/testSchema')
const async = require('async')

exports.home = (req, res, next) => {
  async.parallel({
    news_count: function (callback) {
      News.count()
        .exec(callback)
    }
  }, function (err, count) {
    if (err) {
      return next(err)
    }

    res.render('homefile/home', {
      title: 'Home Page',
      number: count.news_count
    })
  })
}

exports.test_post = (req, res, next) => {
  var qualified = {
    name: req.body.email,
    description: req.body.surname
  }
  Test.findByIdAndUpdate(
    req.params.id,
    qualified, {},

    (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    }
  )
}

exports.aboutus = (req, res, next) => {
  res.render('homefile/aboutus', {
    title: 'About IMSU Psychology'
  })
}

exports.default_news = (req, res, next) => {
  News.find({}, function (err, latest) {
    if (err) {
      return next(err)
    }
    res.render('homefile/news', {
      title: 'NEWS PAGE',
      newspaper: latest,
      helpers: {
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

// GET Home full NEWS
exports.get_full_news = (req, res, next) => {
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
      res.render('homefile/fullnews', {
        title: 'Psychology Full News',
        newspaper: news,
        comments: news.comments,
        decipher: function () {
          var liked = []
          var answer = []
          var stud = students
          var lik = news.likey
          lik.forEach(element => {
            liked.push(element)
          })
          stud.filter(hero => {
            for (var i = 0; i < liked.length; i++) {
              if (liked[i] == hero.id) {
                answer.push(hero)
              }
            }
          })
          return answer
        },
        desliker: function () {
          var liked = []
          var answer = []
          var stud = students
          var lik = news.dislikey
          lik.forEach(element => {
            liked.push(element)
          })
          stud.filter(hero => {
            for (var i = 0; i < liked.length; i++) {
              if (liked[i] == hero.id) {
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

exports.history = (req, res, next) => {
  res.render('homefile/history', {
    title: 'History of NAPS'
  })
}

exports.objective = (req, res, next) => {
  res.render('homefile/objectives', {
    title: 'objectives of NAPS'
  })
}

exports.guidelines = (req, res, next) => {
  res.render('homefile/guidelines', {
    title: 'Guidelines of NAPS'
  })
}

exports.orientation = (req, res, next) => {
  res.render('homefile/orientation', {
    title: 'Orientation'
  })
}

exports.exam = (req, res, next) => {
  res.render('homefile/examination', {
    title: 'Examination Rules and Regulations'
  })
}

exports.libinfo = (req, res, next) => {
  res.render('homefile/libraryInfo', {
    title: 'Library Informations'
  })
}

exports.onelevel = (req, res, next) => {
  res.render('homefile/100levelcourse', {
    title: '100level'
  })
}

exports.twolevel = (req, res, next) => {
  res.render('homefile/200levelcourse', {
    title: '200level'
  })
}

exports.threelevel = (req, res, next) => {
  res.render('homefile/300levelcourse', {
    title: '300level'
  })
}

exports.fourlevel = (req, res, next) => {
  res.render('homefile/400levelcourse', {
    title: '400level'
  })
}
