var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var adminSchema = new schema({
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
    gender: {
        type: String,
        required: true
    },
    verify: {
        type: String,
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

//Virtual for ADMIN's URL
adminSchema
    .virtual('url')
    .get(function () {
        return '/adminss/' + this._id;
    });

// creating a student model and exporting the module
module.exports = mongoose.model('Admins', adminSchema);