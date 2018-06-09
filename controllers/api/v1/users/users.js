const { User } = require("../../../../models/schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  signUp: async (req, res, next) => {
    let validUser = req.value.body;
    bcrypt.hash(validUser.password, saltRounds, async (err, password) => {
      try {
        /* Update password with encryption before creating new user*/
        validUser.password = password;
        const user = await User.query().insert(validUser);
        delete validUser.password;
        req.login(user.id, () => res.json(validUser));
      } catch (error) {
        res.status(403).json(error);
      }
    });
  },
  signIn: async (req, res, next) => {
    console.log("UsersController.signIn() called!");
  },
  secret: async (req, res, next) => {
    console.log("UsersController.secret() called!");
  }
};
