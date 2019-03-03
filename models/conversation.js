var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var conversationSchema = new schema({
    participants: []
});

// creating a student model and exporting the module
module.exports = mongoose.model('Conversation', conversationSchema);