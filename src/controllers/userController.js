const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const email = require("../utilities/email.js");

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },
  create(req, res, next){
    let user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(user, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {

        userQueries.getUser(user.id, (err, result) => {
          passport.authenticate("local")(req, res, () => {
            email(user.name, user.email);
            req.flash("notice", "You've succesfully signed up!");
            res.redirect(`/users/${user.id}/status`);
          })
        })
      }
    });
  },
  signInForm(req, res, next){
    res.render("users/sign_in");
  },
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've succesfully signed in!");
        res.redirect("/");
      }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've succesfully signed out!");
    res.redirect("/");
  },
  show(req, res, next){
    userQueries.getUser(req.params.id, (err, result) => {

      if(err || result.user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {...result})
      }
    })
  },
  change(req, res, next){
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || result.user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect(404, `/users/${req.params.id}`);
      } else {
        const user = result.user
        res.render("users/status", {user});
      }
    })
  },
  premium(req, res, next){
    var stripe = require("stripe")("pk_test_Q7RrOMow6AlxdPcFSWmqxy5400OZxsCg2D");

    const token = req.body.stripeToken;

    const charge = stripe.charges.create({
      amount: 999,
      currency: "usd",
      description: "Upgrade to Premium charge",
      source: token
    });

    userQueries.updateUserRole(req.params.id, 1, (err, user) => {
      if (err || user == null){
        req.flash("notice", "No user found matching that ID.")
        res.redirect(404, `/users/${req.params.id}`);
      } else {
        req.flash("notice", "Congrats! You have been upgraded to Premium!");
        res.redirect(`/users/${req.params.id}`);
      }
    });
  },
  standard(req, res, next){
    userQueries.updateUserRole(req.params.id, 0, (err, user) => {
      if (err || user == null){
        req.flash("notice", "No user found matching that ID.")
        res.redirect(404, `/users/${req.params.id}`);
      } else {
        wikiQueries.downgradeWikis(req.params.id, (err, wikis) => {
          req.flash("notice", "Your account is now a standard account.");
          res.redirect(`/users/${req.params.id}`);
        })
      }
    })
  }
}
