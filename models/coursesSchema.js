var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var coursesSchema = new Schema({
  coursecode: {
    type: String,
    required: true
  },
  coursetitle: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  borrowed: {
    type: String,
    required: true
  },
  lecturer: [{
    type: Schema.ObjectId,
    ref: 'Staff'
  }],

  student_offering: [{
    type: Schema.ObjectId,
    ref: 'StudentSigns'
  }],

  courseoutliner: [{
    outline: String,
    changed_by: String
  }],
  created: {
    type: Date,
    default: Date()
  },
  updated: {
    type: Date,
    default: Date()
  }
})

// Virtual for Course's URL
coursesSchema
  .virtual('url')
  .get(function () {
    return '/adminviewcourse/' + this._id
  })

coursesSchema
  .virtual('lect')
  .get(function () {
    return '/staff/viewcourse/' + this._id
  })

// creating a student model and exporting the module
module.exports = mongoose.model('Courses', coursesSchema)
