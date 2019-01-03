var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var resultSchema = new schema({
    course: {
        type: schema.ObjectId,
        ref: 'Courses',
        required: true
    },
    student: {
        type: schema.ObjectId,
        ref: 'StudentSigns',
        required: true
    },
    score: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true

    }
});

// creating a result model and exporting the module
module.exports = mongoose.model('Result', resultSchema);