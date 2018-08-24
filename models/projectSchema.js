var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var projectSchema = new schema({
    project: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date()
    }
});

// creating a student model and exporting the module
module.exports = mongoose.model('Project', projectSchema);