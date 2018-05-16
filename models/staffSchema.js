var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var staffSchema = new schema({
    email: {
        type: String,
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
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date()
    }
});

// creating a student model
var Staff = mongoose.model('Staff', staffSchema);

// making this available on other files
module.exports = Staff;