const express = require('express')
const router = express.Router()

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')
const testing_controllers = require('../controllers/testing')

const multer = require('multer')
const cloudinary = require('cloudinary')
const uploaded = require('../upload')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET

})

// FOR HOMEPAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/testpicture', testing_controllers.upload_files)

router.post('/testpicture', uploaded, testing_controllers.post_upload_files)

router.get('/testinggetlastnews', testing_controllers.get_last_news)

router.get('/testinggetfullnews/:id', testing_controllers.get_full_news)
