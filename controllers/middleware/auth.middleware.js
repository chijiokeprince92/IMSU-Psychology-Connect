// this functions checks the continuity of the session
module.exports = {
    loginRequired: function(req, res, next) {
        console.log(req.session)
        if (!req.session.student) {
            res.redirect('login');
        } else {
            next();
        }
    }
}