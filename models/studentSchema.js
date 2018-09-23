var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var studentSchema = new schema({
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
    matnumber: {
        type: Number,
        unique: true,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },

    courses_offered: [],

    photo: {
        type: String,
        required: true
    },
    bio: {
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

//Virtual for Student's URL
studentSchema
    .virtual('url')
    .get(function () {
        return '/studentss/' + this._id;
    });

//Virtual for Student's URL
studentSchema
    .virtual('name')
    .get(function () {
        return this.firstname;
    });

// creating a student model and exporting the module
module.exports = mongoose.model('StudentSigns', studentSchema);