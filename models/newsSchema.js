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
    },
    passage1: {
        type: String
    },
    passage2: {
        type: String
    }
});

//Virtual for ADMIN's URL
newsSchema
    .virtual('url')
    .get(function () {
        return '/getfullnews/' + this._id;
    });

// creating a news model and exporting the module
module.exports = mongoose.model('News', newsSchema);