var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var conversationSchema = new Schema({
  participant1: {
    type: String,
    required: true
  },
  participant2: {
    type: String,
    required: true
  },
  date: {
    type: Date
  }
})

// creating a student model and exporting the module
module.exports = mongoose.model('Conversation', conversationSchema)
