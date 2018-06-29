const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../../config/authConfig");
const { User } = require("../../../../models/schema");

const createToken = user =>
  JWT.sign(
    {
      iss: "ShallEat",
      sub: user.id
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
const maxAge = 1000 * 60 * 60;
const httpOnly = true;
// const secure = true;

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { email, ...restInfo } = req.value.body;
      const provider = { local: { email } };
      const validUser = { provider, ...restInfo };

      const foundUser = await User.query().findOne({ provider });
      if (foundUser) res.status(422).json({ error: "Email is already in use" });

      const user = await User.query().insert(validUser);
      const token = await createToken(user);
      const { password, ...currentUser } = user;

      res.cookie("ShallEat", token, { maxAge, httpOnly });
      res.status(200).json(currentUser);
    } catch (error) {
      res.status(404).json(error);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { user } = req;
      const token = createToken(user);
      const { password, ...currentUser } = user;
      res.cookie("ShallEat", token, { maxAge, httpOnly });
      res.status(200).json(currentUser);
    } catch (error) {
      res.status(404).json(error);
    }
  },
  signOut: async (req, res, next) => {
    try {
      res.cookie("ShallEat", { token: null }, { maxAge: 0, httpOnly });
      res.status(200).json({ message: "You are successfully signed out :)" });
    } catch (error) {
      res.status(404).json(error);
    }
  },
  currentUser: async (req, res, next) => {
    try {
      const { user } = req;
      console.log(user);
      const { password, ...currentUser } = user;
      user ? res.status(200).json(currentUser) : res.status(404);
    } catch (error) {
      res.status(404).json(error);
    }
  },
  secret: async (req, res, next) => {
    console.log({ secret: "this is secret" });
    res.status(200).json({ secret: "this is secret" });
  }
};
