var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var resultSchema = new Schema({
  course: {
    type: Schema.ObjectId,
    ref: 'Courses',
    required: true
  },
  student: {
    type: Schema.ObjectId,
    ref: 'StudentSigns',
    required: true
  },
  score: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true

  },
  created: {
    type: Date,
    default: Date()
  },
  updated: {
    type: Date,
    default: Date()
  }
})

// creating a result model and exporting the module
module.exports = mongoose.model('Result', resultSchema)
