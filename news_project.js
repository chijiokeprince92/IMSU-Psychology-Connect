const multer = require('multer')
const path = require('path')

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/newsproject',
  filename: function (req, file, fn) {
    fn(null, Date.now().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

// init

const news = multer({
  storage: storageEngine,
  limits: {
    filesize: 1500000
  },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback)
  }
}).single('picture')

var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = allowedFileTypes.test(file.mimetype)
  if (extension && mimeType) {
    return cb(null, true)
  } else {
    cb('Invalid file type. Only .PDF file is allowed.')
  }
}

module.exports = news
