const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("./config/authConfig");
const { User } = require("./models/schema");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payLoad, done) => {
      try {
        const user = await User.query().findById(payload.sub);
        if (!user) {
          return don(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
