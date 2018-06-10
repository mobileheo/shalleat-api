const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../../config/authConfig");
const { User } = require("../../../../models/schema");

const saltRounds = 10;
const authToken = id =>
  JWT.sign(
    {
      iss: "ShallEat",
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    JWT_SECRET
  );

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { email, firstName, lastName, password } = req.value.body;
      const provider = { local: { email } };
      const validUser = {
        provider,
        firstName,
        lastName,
        password
      };
      const user = await User.query().insert(validUser);
      const token = authToken(user.id);

      res.json({ token });
    } catch (error) {
      res.status(403).json(error);
    }
  },
  signIn: async (req, res, next) => {},
  secret: async (req, res, next) => {
    console.log("here is secret");
    res.json({ secret: "resource" });
  }
};
