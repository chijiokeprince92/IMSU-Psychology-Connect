var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create schema

var studentlogin = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// create a model
var StudentPress = mongoose.model('StudentPress', studentlogin);

//export the model
module.exports = StudentPress;