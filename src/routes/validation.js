const User = require("../db/models").User;

module.exports = {
  validateUsers(req, res, next) {

    if (req.method === "POST") {
      req.checkBody("name", "must not be empty").optional().not().isEmpty();
      req.checkBody("email", "must be a valid email address").isEmail();
      req.check("email").custom(email => {
        return User.findOne({where: { email: req.body.email }})
        .then((user) => {
          if (user) {
            return Promise.reject("Email must not already be in use")
          }
        })
      })
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
    }

    const errors = req.validationErrors();
    console.log(errors);

    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  },
  validateWikis(req, res, next) {

    if (req.method === "POST") {
      req.checkBody("title", "must be at least 5 characters long").isLength({min: 5});
      req.checkBody("body", "must be at least 10 characters long").isLength({min: 10});
    }

    const errors = req.validationErrors();
    console.log(errors);

    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  }

}
