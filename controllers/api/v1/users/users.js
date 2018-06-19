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
const maxAge = 1000 * 60 * 60;
const httpOnly = true;

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { email, ...restInfo } = req.value.body;
      const provider = { local: { email } };
      const validUser = { provider, ...restInfo };

      const foundUser = await User.query().findOne({ provider });
      if (foundUser) res.status(403).json({ error: "Email is already in use" });

      const user = await User.query().insert(validUser);
      const token = createToken(user);

      res.cookie("ShallEat", token, { maxAge, httpOnly });
      res.status(200).json({ success: "Authorized" });
    } catch (error) {
      res.status(403).json(error);
    }
  },
  signIn: async (req, res, next) => {
    const { user, error } = req;

    const token = createToken(user);

    res.cookie("ShallEat", token, { maxAge, httpOnly });
    res.status(200).json({ success: "Authorized" });
  },
  secret: async (req, res, next) => {
    console.log({ secret: "this is secret" });
    res.status(200).json({ secret: "resource" });
  }
};
