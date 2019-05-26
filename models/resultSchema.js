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

  }
})

// creating a result model and exporting the module
module.exports = mongoose.model('Result', resultSchema)
