const News = require('../models/newsSchema');

const async = require('async');


exports.upload_files = function(req, res) {
    res.render('testing/lovely', {
        testing: 'I AM TESTING THIS API',
        title: 'Testing API',
        layout: 'less_layout'
    })
}

exports.post_upload_files = function(req, res, next) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            console.log('image error');
            return err;
        }
        // add cloudinary url for the image to the topic object under image property

        //add image's public_id to topic object
        console.log(result);


        res.redirect('/');
    });
}

exports.angula = function(req, res) {
    res.render('testing/angular', {
        title: 'Angular Testing',
        treasure: "God of Chosen",
        reals: ["Tina", "Victor", "Elijah", "Queen", "Kristi"],
        agree: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
}

exports.angular = function(req, res) {
    var reals = ["Tina", "Victor", "Elijah", "Queen", "Kristi"];
    var treasure = "God of Chosen";
    var agree = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    res.render('testing/angular', {
        title: 'Angular Testing',
        treasure: treasure,
        reals: reals,
        agree: agree
    });
}

// GET Student latest NEWS
exports.get_count_news = function(req, res, next) {


    News.find({})
        .exec(function(err, release) {
            if (err) {
                return next(err);
            }

            res.json(release);
        });
}

// GET Student latest NEWS
exports.get_last_news = function(req, res, next) {

    News.find({}).sort([
        ['created', 'ascending']
    ]).exec(function(err, release) {
        if (err) {
            return next(err);
        }
        res.render('testing/helper', {
            title: 'Testing News',
            newspaper: release
        });
    });

}

// GET testing full NEWS
exports.get_full_news = function(req, res, next) {
    News.findOne({
        '_id': req.params.id
    }, function(err, release) {
        if (err) {
            return next(err);
        }
        res.render('testing/testingnews', {
            title: 'Testing Full News',
            newspaper: release,
            comments: release.comments
        });
    })
}