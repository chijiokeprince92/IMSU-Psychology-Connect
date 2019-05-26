var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var messageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date()
  }
})

// creating a message model and export the module
module.exports = mongoose.model('Messages', messageSchema)
