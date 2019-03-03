var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var studentSchema = new schema({
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
        unique: true,
        required: true
    },

    courses_offered: [{
        type: schema.ObjectId,
        ref: 'Courses'
    }],

    messages: [{
        type: schema.ObjectId,
        ref: 'Messages'
    }],

    photo: {
        type: String,
        required: true
    },
    is_courserep: {
        type: String,
        default: "No"
    },
    is_graduate: {
        type: String,
        default: "No"
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
    .get(function() {
        return '/studentss/' + this._id;
    });

//Virtual for Student's URL
studentSchema
    .virtual('name')
    .get(function() {
        return this.firstname;
    });

// creating a student model and exporting the module
module.exports = mongoose.model('StudentSigns', studentSchema);