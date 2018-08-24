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
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    phone: {
        type: Number,
        required: true
    },
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

// creating a student model and exporting the module
module.exports = mongoose.model('StudentSigns', studentSchema);