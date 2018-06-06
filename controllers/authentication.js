const passport = require("passport");
const session = require("express-session");
const knex = require('../db');
const bcrypt = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;

module.exports = {
  serializeUser: passport.serializeUser(function (user_id, done) {
    done(null, user_id);
  }),
  deserializeUser: passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
  }),

  authenticationMiddleware() {
    return (req, res, next) => {
      const userId = req.user.id;
      console.log(
        `req.session.passport.user : ${JSON.stringify(req.session.passport)}`
      );

      if (req.isAuthenticated()) return next();

      res.json({
        userId
      });
    }
  },
  passportAuth(type) {
    return () =>
      passport.authenticate(
        type, {
          successRedirect: '/',
          failureRedirect: '/users/login'
        });
  },
  localStrategy: passport.use(new LocalStrategy(
    function (username, password, done) {
      console.log(username)
      console.log(password)

      knex('users')
        .where({
          username: username
        })
        .select('id', 'password')
        .then(([user]) => {
          console.log(user);
          user ?
            bcrypt.compare(password, user.password, (err, res) => {
              if (res === true)
                return done(null, {
                  user_id: user.id
                });
              else
                return done(null, false);
            }) :
            done(null, false);
        })
        .catch(err => {
          console.log(`error => ${err}`);
          done(err)
        });
      // return done(null, 'false');
    }
  ))
}