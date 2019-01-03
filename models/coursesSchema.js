var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema
var coursesSchema = new schema({
    coursecode: {
        type: String,
        required: true
    },
    coursetitle: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    borrowed: {
        type: String,
        required: true
    },
    lecturer: [{
        type: schema.ObjectId,
        ref: 'Staff'
    }],

    student_offering: [{
        type: schema.ObjectId,
        ref: 'StudentSigns'
    }],

    courseoutline: {
        type: String
    }
});

//Virtual for Course's URL
coursesSchema
    .virtual('url')
    .get(function() {
        return '/adminviewcourse/' + this._id;
    });

coursesSchema
    .virtual('urly')
    .get(function() {
        return '/staffviewcourse/' + this._id;
    });


// creating a student model and exporting the module
module.exports = mongoose.model('Courses', coursesSchema);