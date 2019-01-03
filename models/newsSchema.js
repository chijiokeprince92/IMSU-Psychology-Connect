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
    },
    comments: [{
        specialid: String,
        user: String,
        comment: String,
        like: {
            type: Number,
            default: 0
        },
        dislike: {
            type: Number,
            default: 0
        },
        reply: []
    }],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
});

//Virtual for ADMIN's URL
newsSchema
    .virtual('url')
    .get(function() {
        return '/getfullnews/' + this._id;
    });

// creating a news model and exporting the module
module.exports = mongoose.model('News', newsSchema);