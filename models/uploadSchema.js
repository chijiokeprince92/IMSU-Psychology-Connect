var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var uploadSchema = new schema({
    path: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    }
});

// creating a student model and exporting the module
module.exports = mongoose.model('Uploads', uploadSchema);