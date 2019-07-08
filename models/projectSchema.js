var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var projectSchema = new Schema({
  project: {
    url: String,
    public_id: String
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
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
module.exports = mongoose.model('Project', projectSchema)
