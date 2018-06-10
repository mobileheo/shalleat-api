const Joi = require("joi");
const VALID_PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/i;

module.exports = {
  validateNewUser: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    const { pwMatch, ...user } = req.body;
    if (result.error) return res.status(400).json(result.error);

    if (user.password !== pwMatch)
      return res.status(400).json({
        error: "Passwords do not match, please try again."
      });

    if (!req.value) req.value = {};
    req.value.body = user;
    next();
  },

  newUserSchemas: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string()
        .regex(VALID_PASSWORD_REGEX)
        .required(),
      pwMatch: Joi.string()
        .regex(VALID_PASSWORD_REGEX)
        .required()
    })
  },

  validateSignIn: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    const { email, password } = req.body;

    if (result.error) return res.status(400).json(result.error);

    if (!email || !password)
      return res.status(400).json({
        error:
          "Either email or password are missed, please provide both email and password"
      });

    if (!req.value) req.value = {};
    req.value.body = req.body;
    next();
  },

  signInUserSchemas: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(VALID_PASSWORD_REGEX)
        .required()
    })
  }
};
