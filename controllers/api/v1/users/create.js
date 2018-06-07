const knex = require("../../../../db"),
  passport = require("passport"),
  session = require("express-session"),
  bcrypt = require("bcrypt"),
  saltRounds = 10,
  { User } = require("../../../../models/schema");

const isValidPassword = password =>
  password.match(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/i
  );
const mismatchPassword = "Passwords do not match, please try again.";
const invalidPassword =
  "Password must include one lowercase character, one uppercase character, a number, and a special character.";
const insertUser = (req, res) => {
  const userInput = req.body;
  const provider = "local";
  delete userInput.pwMatch;
  let validUser = Object.assign(userInput, {
    provider
  });

  bcrypt.hash(userInput.password, saltRounds, async function(err, password) {
    try {
      /* For testing purpose to avoid unique key violation*/
      validUser.password = password;
      // const deletedRow = await User.query()
      //   .orderBy("id", "desc")
      //   .first()
      //   .delete();
      const user = await User.query().insert(validUser);
      delete validUser.password;
      delete validUser.id;
      req.login(user.id, err => {
        console.log(`login error => ${err}`);
        res.json(validUser);
      });
    } catch (error) {
      // console.log(error);
      res.json(error);
    }
  });
};
module.exports = {
  async localLogin(req, res, next) {
    const { password, pwMatch } = req.body;
    const userInput = req.body;
    const provider = "local";
    if (password !== pwMatch) {
      res.json({
        mismatchPassword
      });
    } else if (!isValidPassword(password)) {
      res.json({
        invalidPassword
      });
    } else {
      insertUser(req, res);
    }
  }
};
