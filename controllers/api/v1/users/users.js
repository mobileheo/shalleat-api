const JWT = require("jsonwebtoken");
const { jwtSecret } = require("../../../../config/authConfig");
const { User } = require("../../../../models/schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const authToken = id =>
  JWT.sign(
    {
      iss: "ShallEat",
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    jwtSecret
  );

module.exports = {
  signUp: async (req, res, next) => {
    let validUser = req.value.body;
    bcrypt.hash(validUser.password, saltRounds, async (err, password) => {
      try {
        /* Update password with encryption before creating new user*/
        validUser.password = password;
        const user = await User.query().insert(validUser);
        delete validUser.password;
        const token = authToken(user.id);
        req.login(user.id, () => res.json({ token }));
      } catch (error) {
        res.status(403).json(error);
      }
    });
  },
  signIn: async (req, res, next) => {},
  secret: async (req, res, next) => {
    console.log("UsersController.secret() called!");
  }
};
