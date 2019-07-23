var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var newsSchema = new Schema({
  picture: {
    url: String,
    public_id: String
  },
  heading: {
    type: String,
    required: true
  },
  passage: {
    type: String,
    required: true
  },
  passage1: {
    type: String
  },
  passage2: {
    type: String
  },
  comments: [{
    userid: String,
    comment: String,
    like: {
      type: Number,
      default: 0
    },
    dislike: {
      type: Number,
      default: 0
    },
    reply: []
  }],
  likey: [],
  dislikey: [],
  created: {
    type: Date
  },
  updated: {
    type: Date
  }
})

// Virtual for Student's URL
newsSchema
  .virtual('url')
  .get(function () {
    return '/getfullnews/' + this._id
  })

newsSchema
  .virtual('adminurl')
  .get(function () {
    return '/admin/getfullnews/' + this._id
  })

// creating a student model and exporting the module
module.exports = mongoose.model('News', newsSchema)
