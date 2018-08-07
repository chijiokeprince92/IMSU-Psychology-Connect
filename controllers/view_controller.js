exports.home = function (req, res, next) {
    res.render('student/home', {
        title: 'Home Page',
        allowed: req.session.student
    })
};

exports.history = function (req, res, next) {
    res.render('student/history', {
        title: 'History of NAPS',
        allowed: req.session.student
    });
};

exports.objective = function (req, res, next) {
    res.render('student/objectives', {
        title: 'objectives of NAPS',
        allowed: req.session.student
    });
};

exports.guidelines = function (req, res, next) {
    res.render('student/guidelines', {
        title: 'Guidelines of NAPS',
        allowed: req.session.student
    });
};

exports.orientation = function (req, res, next) {
    res.render('student/orientation', {
        title: 'Orientation',
        allowed: req.session.student
    });
};

exports.exam = function (req, res, next) {
    res.render('student/examination', {
        title: 'Examination Rules and Regulations',
        allowed: req.session.student
    });
};


exports.libinfo = function (req, res, next) {
    res.render('student/libraryInfo', {
        title: 'Library Informations',
        allowed: req.session.student
    });
};

exports.library = function (req, res, next) {
    res.render('student/Library', {
        title: 'library',
        allowed: req.session.student
    });
};


exports.onelevel = function (req, res, next) {
    res.render('student/100levelcourse', {
        title: '100level',
        allowed: req.session.student
    });
};

exports.twolevel = function (req, res, next) {
    res.render('student/200levelcourse', {
        title: '200level',
        allowed: req.session.student
    });
};

exports.threelevel = function (req, res, next) {
    res.render('student/300levelcourse', {
        title: '300level',
        allowed: req.session.student
    });
};

exports.fourlevel = function (req, res, next) {
    res.render('student/400levelcourse', {
        title: '400level',
        allowed: req.session.student
    });
};

exports.news = function (req, res, next) {
    res.render('student/News', {
        title: 'news',
        allowed: req.session.student
    });
};

exports.bookshop = function (req, res, next) {
    res.render('student/BuyBooks', {
        title: 'book Shop',
        allowed: req.session.student
    });
};

exports.elibrary = function (req, res, next) {
    res.render('student/ELibrary', {
        title: 'E-library',
        allowed: req.session.student
    });
};

exports.project = function (req, res, next) {
    res.render('student/projectTopics', {
        title: 'Project Topics',
        allowed: req.session.student
    });
};

exports.article = function (req, res, next) {
    res.render('student/addArticle', {
        title: 'Add an Article',
        allowed: req.session.student
    });
};