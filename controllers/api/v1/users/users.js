const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../../config/authConfig");
const { User } = require("../../../../models/schema");

const createToken = user =>
  JWT.sign(
    {
      iss: "ShallEat",
      sub: user.id,
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
      const token = createToken(user);

      res.json({ token });
    } catch (error) {
      res.status(403).json(error);
    }
  },
  signIn: async (req, res, next) => {
    console.log(req.user);
    const token = createToken(req.user);
    res.status(200).json({ token });
    // console.log("signin");
  },
  secret: async (req, res, next) => {
    // console.log("here is secret");
    res.json({ secret: "resource" });
  }
};
