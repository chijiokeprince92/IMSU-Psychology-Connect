const News = require('../models/newsSchema');
const async = require('async');



exports.home = (req, res, next) => {
    async.parallel({
        news_count: function(callback) {
            News.count()
                .exec(callback);
        },
    }, function(err, count) {
        if (err) {
            return next(err)
        }

        res.render('homefile/home', {
            title: 'Home Page',
            number: count.news_count
        });
    });
};

exports.ajax = function(req, res) {
    res.render('homefile/ajax', {
        title: 'AJAX Testing Page'
    });
}

exports.aboutus = (req, res, next) => {
    res.render('homefile/aboutus', {
        title: 'About IMSU Psychology'
    });
}

exports.angular = (req, res) => {
    res.render('homefile/angulartesting', {
        title: 'Angular Testing Page'
    });
}

exports.default_news = (req, res, next) => {
    News.find({}, function(err, latest) {
        if (err) {
            return next(err);
        }
        res.render('homefile/news', {
            title: 'NEWS PAGE',
            newspaper: latest
        })
    })
}

// GET Home full NEWS
exports.get_full_news = (req, res, next) => {
    News.findOne({
        '_id': req.params.id
    }, function(err, release) {
        if (err) {
            return next(err);
        }
        res.render('homefile/fullnews', {
            title: 'Psychology Full News',
            newspaper: release
        });
    })
}

exports.history = (req, res, next) => {
    res.render('homefile/history', {
        title: 'History of NAPS'
    });
};

exports.objective = (req, res, next) => {
    res.render('homefile/objectives', {
        title: 'objectives of NAPS'
    });
};

exports.guidelines = (req, res, next) => {
    res.render('homefile/guidelines', {
        title: 'Guidelines of NAPS'
    });
};

exports.orientation = (req, res, next) => {
    res.render('homefile/orientation', {
        title: 'Orientation'
    });
};

exports.exam = (req, res, next) => {
    res.render('homefile/examination', {
        title: 'Examination Rules and Regulations'
    });
};


exports.libinfo = (req, res, next) => {
    res.render('homefile/libraryInfo', {
        title: 'Library Informations'
    });
};


exports.onelevel = (req, res, next) => {
    res.render('homefile/100levelcourse', {
        title: '100level'
    });
};

exports.twolevel = (req, res, next) => {
    res.render('homefile/200levelcourse', {
        title: '200level'
    });
};

exports.threelevel = (req, res, next) => {
    res.render('homefile/300levelcourse', {
        title: '300level'
    });
};

exports.fourlevel = (req, res, next) => {
    res.render('homefile/400levelcourse', {
        title: '400level'
    });
};