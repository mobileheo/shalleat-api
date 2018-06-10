module.exports = {
  BCRYPT_SSECRET: "[your BCRYPT_SSECRET]",
  JWT_SECRET: "[your JWT_SECRET]",
  googleConfig: {
    clientID: "[your clientID]",
    clientSecret: "[your clientSecret]",
    callbackURL: "[your callbackURL]"
  },
  googleScope: {
    scope: "[your scope]"
  },

  facebookConfig: {
    clientID: "[your clientID]",
    clientSecret: "[your clientSecret]",
    callbackURL: "[your callbackURL]",
    profileFields: "[your profileFields]"
  },
  facebookScope: {
    scope: "[your scope]"
  },

  instagramConfig: {
    clientID: "[your clientID]",
    clientSecret: "[your clientSecret]",
    callbackURL: "[your callbackURL]"
  },
  instagramScope: {
    scope: "[your scope]"
  },

  redicrectObj: {
    successRedirect: "/",
    failureRedirect: "/users/login"
  }
};
