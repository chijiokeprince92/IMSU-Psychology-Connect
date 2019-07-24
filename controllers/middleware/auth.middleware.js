// this functions checks the continuity of the session
module.exports = {
  loginRequired: function (req, res, next) {
    if (!req.session.student) {
      res.redirect('/login')
    } else {
      next()
    }
  },
  isDisabled: function (req, res, next) {
    if (req.session.student.disabled) {
      console.log(req.session.student)
      req.flash('message', 'Your account is disabled, contact the HOD for more informations')
      res.redirect(302, '/studenthome')
    } else {
      next()
    }
  },
  ensureCorrectuser: function (req, res, next) {
    if (req.session.student.id !== req.params.id) {
      res.redirect('/login')
    } else {
      next()
    }
  }
}
