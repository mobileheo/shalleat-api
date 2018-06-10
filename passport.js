const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const { JWT_SECRET } = require("./config/authConfig");
const { User } = require("./models/schema");

// const opts = {
// jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
// secretOrKey = 'secret',
// issuer = 'accounts.examplesoft.com',
// audience = 'yoursite.net'
// };

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payLoad, done) => {
      try {
        const user = await User.query().findById(payLoad.sub);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        const provider = { local: { email } };
        // console.log("email", email);
        const user = await User.query().findOne({ provider });
        // console.log(user);
        if (!user) return done(null, false);

        const isCorretPassword = await user.isValidPassword(password);
        if (!isCorretPassword) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
