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
      const { email, ...restInfo } = req.value.body;
      const provider = { local: { email } };
      const validUser = { provider, ...restInfo };

      const user = await User.query().insert(validUser);
      const token = createToken(user);

      res.json({ token });
    } catch (error) {
      res.status(403).json(error);
    }
  },
  signIn: async (req, res, next) => {
    const token = createToken(req.user);

    res.status(200).json({ token });
  },
  secret: async (req, res, next) => {
    res.json({ secret: "resource" });
  }
};
