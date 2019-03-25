const multer = require('multer')
const path = require('path')

/*

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'demo',
    allowedFormats: ['jpg', 'png'],
    transformation: [{
        width: 500,
        height: 500,
        crop: 'limit'
    }]
});

const parser = multer({
    storage: storage
});

*/

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/files',
  filename: function (req, file, fn) {
    fn(null, Date.now().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

// validate file

const validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = allowedFileTypes.test(file.mimetype)
  if (extension && mimeType) {
    return cb(null, true)
  } else {
    cb('Invalid file type. Only JPEG, PNG and GIF file are allowed.')
  }
}
const upload = multer({
  storage: storageEngine,
  limits: {
    filesize: 200000
  },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback)
  }
}).single('image')

module.exports = upload
