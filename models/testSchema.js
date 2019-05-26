var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var testSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true

  }
})

// creating a result model and exporting the module
module.exports = mongoose.model('Test', testSchema)
