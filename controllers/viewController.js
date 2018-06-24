exports.home = function (req, res, next) {
    res.cookie('name', 'pearl');
    res.render('pages/home', {
        title: 'Home Page',
    })
};



exports.history = function (req, res, next) {
    res.render('pages/history', {
        title: 'History of NAPS'
    });
};

exports.objective = function (req, res, next) {
    res.render('pages/objectives', {
        title: 'objectives of NAPS'
    });
};

exports.guidelines = function (req, res, next) {
    res.render('pages/guidelines', {
        title: 'Guidelines of NAPS'
    });
};

exports.orientation = function (req, res, next) {
    res.render('pages/orientation', {
        title: 'Orientation'
    });
};

exports.exam = function (req, res, next) {
    res.render('pages/examination', {
        title: 'Examination Rules and Regulations'
    });
};


exports.libinfo = function (req, res, next) {
    res.render('pages/libraryInfo', {
        title: 'Library Informations'
    });
};

exports.library = function (req, res, next) {
    res.render('pages/Library', {
        title: 'library'
    });
};


exports.onelevel = function (req, res, next) {
    res.render('pages/100levelcourse', {
        title: '100level'
    });
};

exports.twolevel = function (req, res, next) {
    res.render('pages/200levelcourse', {
        title: '200level'
    });
};

exports.threelevel = function (req, res, next) {
    res.render('pages/300levelcourse', {
        title: '300level'
    });
};

exports.fourlevel = function (req, res, next) {
    res.render('pages/400levelcourse', {
        title: '400level'
    });
};

exports.news = function (req, res, next) {
    res.render('pages/News', {
        title: 'news'
    });
};

exports.bookshop = function (req, res, next) {
    res.render('pages/BuyBooks', {
        title: 'book Shop'
    });
};

exports.elibrary = function (req, res, next) {
    res.render('pages/ELibrary', {
        title: 'E-library'
    });
};

exports.project = function (req, res, next) {
    res.render('pages/projectTopics', {
        title: 'Project Topics'
    });
};

exports.article = function (req, res, next) {
    res.render('pages/addArticle', {
        title: 'Add an Article'
    });
};