const News = require('../models/newsSchema')
const StudentSigns = require('../models/studentSchema')
const async = require('async')
const moment = require('moment')

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

exports.aboutus = (req, res, next) => {
  res.render('homefile/aboutus', {
    title: 'About IMSU Psychology'
  })
}

exports.default_news = (req, res, next) => {
  News.find({}).sort([
    ['updated', 'descending']
  ]).exec(function (err, latest) {
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
        },
        datey: function (user) {
          return moment(user).format('L')
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
        commune: function () {
          var answer = []

          students.filter(hero => {
            for (var i = 0; i < news.comments.length; i++) {
              if (news.comments[i].userid == hero.id) {
                let commenter = {
                  user: `${hero.surname} ${hero.firstname}`,
                  photo: hero.photo,
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
              if (news.likey[i] == hero.id) {
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
              if (news.dislikey[i] == hero.id) {
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
