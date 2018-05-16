var mongoose = require('mongoose');
var schema = mongoose.Schema;

//create schema

var stafflogin = new schema({
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
var staffPress = mongoose.model("staffPress", stafflogin);

//export the model
module.exports = staffPress;