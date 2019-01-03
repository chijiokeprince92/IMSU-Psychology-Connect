var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var timetableSchema = new schema({
    level: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true

    }
});

// creating a student model and exporting the module
module.exports = mongoose.model('Timetable', timetableSchema);