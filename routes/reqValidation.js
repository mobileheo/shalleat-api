const joi = requrie("joi");
const VALID_PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/i;

module.exports = {
  validateUser: schema => {
    const result = joi.validate(req.body, schema);
    const { password, pwMatch } = req.body;
    if (result.error) return res.status(400).json(result.error);

    if (password !== pwMatch)
      return res.status(400).json({
        error: "Passwords do not match, please try again."
      });

    if (!req.value) req.value = {};
    const { pwMatch, ...user } = req.body;
    req.value.body = user;
    next();
  },

  schema: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      firstName: Joi.string.requrired(),
      lastName: Joi.string.requrired(),
      password: Joi.string()
        .regex(VALID_PASSWORD_REGEX)
        .required(),
      pwMatch: Joi.string()
        .regex(VALID_PASSWORD_REGEX)
        .required()
    })
  }
};
