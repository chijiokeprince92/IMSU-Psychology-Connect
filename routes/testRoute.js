const express = require('express')
const router = express.Router()

// middlewares
const authMiddleware = require('../controllers/middleware/auth.middleware')

const multer = require('multer')
const cloudinary = require('cloudinary')
const uploaded = require('../upload')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET

})

// FOR HOMEPAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
