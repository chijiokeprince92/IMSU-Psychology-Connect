var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var staffSchema = new schema({
    email: {
        type: String,
        unique: true,
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
    staff_id: {
        type: String,
        enum: ["12345", "54321", "12ab345"],
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

    courses_lectured: [],

    photo: {
        type: String
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

staffSchema
    .virtual('name')
    .get(function () {
        return this.surname + ' ' + this.firstname;
    });

//Virtual for Student's URL
staffSchema
    .virtual('url')
    .get(function () {
        return '/staffss/' + this._id;
    });


// creating a student model and exporting the module
module.exports = mongoose.model('Staff', staffSchema);