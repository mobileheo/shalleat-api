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
      first_name,
      last_name,
      password,
      pwMatch
    } = req.body;
    const provider = "local"
    bcrypt.hash(password, saltRounds, async function (err, password) {
      try {
        const user = await User.query().insert({
          username, email, first_name, last_name, password, provider
        })
        req.login(user.id, err => {
          console.log(`err => ${err}`)
          res.json({username, email, firstanme, last_name, provider})
        });
      } catch (err) {
        console.log(err instanceof objection.ValidationError); // --> true
        console.log(err.data); // --> {lastName: [{message: 'required property missing', ...}]}
        res.json(err.data);
      }
    });
  }
}
