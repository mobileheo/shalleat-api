const knex = require("../../../../db"),
  passport = require("passport"),
  session = require("express-session"),
  bcrypt = require("bcrypt"),
  saltRounds = 10,
  {
    User,
  } = require('../../../../models/schema');

  module.exports = {
    async localLogin(req, res, next) {
      const {
        username,
        email,
        firstName,
        lastName,
        password,
        pwMatch
      } = req.body;
      const provider = "local"
      if (password !== pwMatch) {
        res.json({
          error: "Passwords do not match, please try again."
        })
      } else {
      bcrypt.hash(password, saltRounds, async function (err, password) {
        try {
          const user = await User.query().insert({
            username, email, firstName, lastName, password, provider
          })
          req.login(user.id, err => {
            console.log(`err => ${err}`)
            res.json({username, email, firstName, lastName, provider})
          });
        } catch (err) {
            console.log(err.message);
            res.json({error: err.message});
        }
      });
    }
  }
}