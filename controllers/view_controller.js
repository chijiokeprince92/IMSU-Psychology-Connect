const News = require('../models/newsSchema');
const async = require('async');


exports.home = function (req, res, next) {
    async.parallel({
        news_count: function (callback) {
            News.count()
                .exec(callback);
        },
    }, function (err, count) {
        if (err) {
            return next(err)
        }
        res.render('homefile/home', {
            title: 'Home Page',
            number: count.news_count
        });
    })

};

exports.aboutus = function (req, res, next) {
    res.render('homefile/aboutus', {
        title: 'About IMSU Psychology'
    });
}

exports.default_news = function (req, res, next) {
    News.find({}, function (err, latest) {
        if (err) {
            return next(err);
        }
        res.render('homefile/news', {
            title: 'NEWS PAGE',
            newspaper: latest
        })
    })
}

exports.history = function (req, res, next) {
    res.render('homefile/history', {
        title: 'History of NAPS'
    });
};

exports.objective = function (req, res, next) {
    res.render('homefile/objectives', {
        title: 'objectives of NAPS'
    });
};

exports.guidelines = function (req, res, next) {
    res.render('homefile/guidelines', {
        title: 'Guidelines of NAPS'
    });
};

exports.orientation = function (req, res, next) {
    res.render('homefile/orientation', {
        title: 'Orientation'
    });
};

exports.exam = function (req, res, next) {
    res.render('homefile/examination', {
        title: 'Examination Rules and Regulations'
    });
};


exports.libinfo = function (req, res, next) {
    res.render('homefile/libraryInfo', {
        title: 'Library Informations'
    });
};


exports.onelevel = function (req, res, next) {
    res.render('homefile/100levelcourse', {
        title: '100level'
    });
};

exports.twolevel = function (req, res, next) {
    res.render('homefile/200levelcourse', {
        title: '200level'
    });
};

exports.threelevel = function (req, res, next) {
    res.render('homefile/300levelcourse', {
        title: '300level'
    });
};

exports.fourlevel = function (req, res, next) {
    res.render('homefile/400levelcourse', {
        title: '400level'
    });
};