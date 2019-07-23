var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var studentSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  matnumber: {
    type: Number,
    unique: true,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    unique: true,
    required: true
  },
  friends: [],

  courses_offered: [{
    type: Schema.ObjectId,
    ref: 'Courses'
  }],

  messages: [{
    type: Schema.ObjectId,
    ref: 'Messages'
  }],
  priviledges: [{
    dir_of_sports: { type: Boolean, default: false }
  },
  {
    dir_of_finance: { type: Boolean, default: false }
  },
  {
    course_rep: { type: Boolean, default: false }
  },
  {
    graduate: { type: Boolean, default: false }
  }
  ],
  photo: {
    url: String,
    public_id: String
  },
  other_photos: [{
    type: String
  }],
  is_courserep: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  updated: {
    type: Date
  }
})

// Virtual for Student's URL
studentSchema
  .virtual('url')
  .get(function () {
    return '/studentss/' + this._id
  })

// Virtual for Student's URL
studentSchema
  .virtual('name')
  .get(function () {
    return this.firstname
  })

// creating a student model and exporting the module
module.exports = mongoose.model('StudentSigns', studentSchema)
