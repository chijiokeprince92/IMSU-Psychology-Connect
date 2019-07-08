var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var timetableSchema = new Schema({
  level: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  course: {
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

// creating a student model and exporting the module
module.exports = mongoose.model('Timetable', timetableSchema)
