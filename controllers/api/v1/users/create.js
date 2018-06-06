const knex = require("../../../../db"),
  passport = require("passport"),
  session = require("express-session"),
  bcrypt = require("bcrypt"),
  {
    User,
    Restaurant
  } = require('../../../../models/schema'),
  saltRounds = 10;

module.exports = {
   async localLogin(req, res, next) {
    const {
      username,
      email,
      first_name,
      last_name,
      password,
      pwMatch
    } = req.body;

    bcrypt.hash(password, saltRounds, async function (err, password) {
      try {
        const user = await User.query().insert({
          username, email, first_name, last_name, password
        })
        req.login(user.id, err => {
          console.log(`err => ${err}`)
          res.json(user)
        });
      } catch (err) {
        console.log(err instanceof objection.ValidationError); // --> true
        console.log(err.data); // --> {lastName: [{message: 'required property missing', ...}]}
        next();
      }
    });
  }
}
