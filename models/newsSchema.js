var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var newsSchema = new schema({
    picture: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    passage: {
        type: String,
        required: true
    }
});

// creating a student model and exporting the module
module.exports = mongoose.model('News', newsSchema);