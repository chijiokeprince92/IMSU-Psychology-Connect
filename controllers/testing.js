const News = require('../models/newsSchema')
const formidable = require('formidable')
const cloudinary = require('cloudinary')

exports.upload_files = function (req, res) {
  res.render('testing/lovely', {
    testing: 'I AM TESTING THIS API',
    title: 'Testing API',
    layout: 'less_layout',
    helpers: {
      prince: function () {
        return `I LOVE JESUS SOOO MUCH`
      },
      is_equal: function (a, b, opts) {
        if (a == b) {
          return opts.fn(this)
        } else {
          return opts.inverse(this)
        }
      }
    }
  })
}

// working on it
exports.post_upload_files = function (req, res, next) {
  var form = new formidable.IncomingForm()
  form.parse(req)
  form.on('fileBegin', function (name, file) {
    // eslint-disable-next-line no-path-concat
    file.path = __dirname + '/formidable/' + file.name
    console.log('The name of the selected file is:', file.path)
  })
  form.on('file', function (name, file) {
    console.log('Uploaded', name, file.path)
    cloudinary.v2.uploader.upload(file.path, function (err, result) {
      if (err) {
        return next(err)
      }
      // add cloudinary url for the image to the topic object under image property

      // add image's public_id to topic object
      console.log(result)

      res.redirect('/testpicture')
    })
  })
  /**
   * { public_id: 'pkupmspiysvy0nx7fska',
  version: 1561113604,
  signature: 'd89dcbad5869e68456af9f7e6cbb410d362b2842',
  width: 480,
  height: 854,
  format: 'png',
  resource_type: 'image',
  created_at: '2019-06-21T10:40:04Z',
  tags: [],
  bytes: 378384,
  type: 'upload',
  etag: '363036d40859a9d1c4eb9a454724cf7a',
  placeholder: false,
  url: 'http://res.cloudinary.com/elijah/image/upload/v1561113604/pkupmspiysvy0nx7fska.png',
  secure_url: 'https://res.cloudinary.com/elijah/image/upload/v1561113604/pkupmspiysvy0nx7fska.png',
  original_filename: 'Screenshot_2018-01-09-07-34-52' }
   */
}

// correct
exports.post_upload_file = function (req, res, next) {
  var fullPath = './files/' + req.file.filename
  cloudinary.v2.uploader.upload('https://s3.amazonaws.com/codecademy-content/courses/learn-bootstrap-4/recycle.jpg', function (err, result) {
    if (err) {
      console.log('image error')
      return next(err)
    }
    // add cloudinary url for the image to the topic object under image property

    // add image's public_id to topic object
    console.log(result)

    res.redirect('/')
  })
}
/*
  { public_id: 'c062l3iqmrqlgh3bpza5',
   version: 1552056227,
   signature: '65f9234c51dfb25dcdf6ea943d69c6417faa5ed9',
   width: 5697,
   height: 3798,
   format: 'jpg',
   resource_type: 'image',
   created_at: '2019-03-08T14:43:47Z',
   tags: [],
   bytes: 4376066,
  type: 'upload',
  etag: '549c10e0fd0ca47b8d127c6924986234',
  placeholder: false,
  url: 'http://res.cloudinary.com/elijah/image/upload/v1552056227/c062l3iqmrqlgh3bpza5.jpg',
 secure_url: 'https://res.cloudinary.com/elijah/image/upload/v1552056227/c062l3iqmrqlgh3bpza5.jpg',
  original_filename: 'recycle' }
 */

// GET Student latest NEWS
exports.get_last_news = function (req, res, next) {
  News.find({}).sort([
    ['created', 'ascending']
  ]).exec(function (err, release) {
    if (err) {
      return next(err)
    }
    res.render('testing/helper', {
      title: 'Testing News',
      newspaper: release
    })
  })
}

// GET testing full NEWS
exports.get_full_news = function (req, res, next) {
  News.findOne({
    '_id': req.params.id
  }, function (err, release) {
    if (err) {
      return next(err)
    }
    res.render('testing/testingnews', {
      title: 'Testing Full News',
      newspaper: release,
      comments: release.comments
    })
  })
}
