var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var messageSchema = new schema({
    conversationid: {
        type: schema.ObjectId,
        ref: 'Conversation'
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date()

    }
});

// creating a student model and exporting the module
module.exports = mongoose.model('Messages', messageSchema);