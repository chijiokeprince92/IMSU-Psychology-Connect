var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var staffSchema = new Schema({
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
  staff_id: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },

  priviledges: [{
    course_adviser: { type: Boolean, default: false }
  },
  {
    hod: { type: Boolean, default: false }
  },
  {
    semi_admin: { type: Boolean, default: false }
  },
  {
    phd: { type: Boolean, default: false }
  }
  ],
  photo: {
    url: String,
    public_id: String
  },
  other_photos: [{
    type: String
  }],
  disabled: {
    type: Boolean,
    default: false
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
    type: Date,
    default: Date()
  }
})

staffSchema
  .virtual('name')
  .get(function () {
    return this.surname + ' ' + this.firstname
  })

// Virtual for Student's URL
staffSchema
  .virtual('url')
  .get(function () {
    return '/staff/profile/' + this.id
  })

// Virtual for Student's URL
staffSchema
  .virtual('urly')
  .get(function () {
    return '/admin/staffprofile/' + this._id
  })

// creating a student model and exporting the module
module.exports = mongoose.model('Staff', staffSchema)
