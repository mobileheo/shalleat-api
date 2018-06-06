const knex = require("../../db"),
  passport = require("passport"),
  session = require("express-session"),
  bcrypt = require("bcrypt"),
  saltRounds = 10;

module.exports = {
  async index(req, res, next) {
    res.json({
      errors: [],
      userNameErr: [],
      emailErr: [],
      passwordErr: [],
      pwMatchErr: []
    });
  },

  authenticationMiddleware(req, res, next) {
    const session = session;
    const userId = req.user.id;
    console.log(
      `req.session.passport.user : ${JSON.stringify(req.session.passport)}`
    );

    if (req.isAuthenticated()) return next();

    res.json({
      userId
    });
  },

  localLogin(req, res, next) {
    req.checkBody("username", "Username field cannot be empty.").notEmpty();
    req
      .checkBody("username", "Username must be between 4-15 characters long.")
      .len(4, 15);
    req
      .checkBody("email", "The email you entered is invalid, please try again.")
      .isEmail();
    req
      .checkBody(
        "email",
        "Email address must be between 4-100 characters long, please try again."
      )
      .len(4, 100);
    req
      .checkBody("password", "Password must be between 8-100 characters long.")
      .len(8, 100);
    req
      .checkBody(
        "password",
        "Password must include one lowercase character, one uppercase character, a number, and a special character."
      )
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
        "i"
      );
    req
      .checkBody("pwMatch", "Password must be between 8-100 characters long.")
      .len(8, 100);
    req
      .checkBody("pwMatch", "Passwords do not match, please try again.")
      .equals(req.body.password);
    req
      .checkBody(
        "username",
        "Username can only contain letters, numbers, or underscores."
      )
      .matches(/^[A-Za-z0-9_-]+$/, "i");

    const username = req.body.username,
      email = req.body.email,
      password = req.body.password,
      pwMatch = req.body.pwMatch;

    knex("users").select("username");

    const errors = req.validationErrors();

    if (errors) {
      res.json(errors);
    } else {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        knex("users")
          .insert({
            username: username,
            email: email,
            password: hash
          })
          .returning("*")
          .then(([user]) => {
            console.log(user);
            req.login(user.id, err => {
              res.json(user)
            });
          })
          .catch(err => {
            console.log(err);
            res.json(errors);
          });
      });
    }
  }
}