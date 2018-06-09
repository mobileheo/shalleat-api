const passport = require("passport");
const knex = require("../../../../db");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function(email, password, done) {
    knex("users")
      .where({
        email
      })
      .select("id", "password")
      .then(([user]) => {
        user
          ? bcrypt.compare(password, user.password, (err, res) => {
              if (res === true)
                return done(null, {
                  userId: user.id
                });
              else return done(null, false);
            })
          : done(null, false);
      })
      .catch(err => {
        done(err);
      });
  })
);

module.exports = (req, res, next) => {
  res.json({ message: "Authenticated" });
};
