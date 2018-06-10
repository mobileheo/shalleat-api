const fs = require("fs"),
  path = require("path"),
  knex = require("./db"),
  environment = process.env.NODE_ENV || "development",
  logger = require("morgan"),
  express = require("express"),
  https = require("https"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  { BCRYPT_SSECRET } = require("./config/authConfig");

app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app
  .use(bodyParser.json())
  .use(cookieParser())
  .set("json spaces", 2);

const certOptions = {
  key: fs.readFileSync(path.resolve("./encryption/server.key")),
  cert: fs.readFileSync(path.resolve("./encryption/server.crt"))
};

const passport = require("passport"),
  session = require("express-session"),
  KnexSessionStore = require("connect-session-knex")(session);

const store = new KnexSessionStore({
  knex: knex,
  tablename: "sessions" // optional. Defaults to 'sessions'
});

app
  .use(
    session({
      // cookie: {
      //   secure: true,
      //   maxAge: 60000
      // },
      store: store,
      saveUninitialized: true,
      secret: BCRYPT_SSECRET,
      resave: true
    })
  )
  .use(passport.initialize())
  .use(passport.session());

passport.serializeUser((user, done) => {
  if (user) {
    done(null, user);
  } else {
    done(new Error("Please provide valid email or password"));
  }
});

passport.deserializeUser((user, done) => done(null, user));

app.use((req, res, next) => {
  // console.log("isAuthenticated? = ", req.isAuthenticated());
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const usersAPI = require("./routes/api/v1/usersAPI");
const users = require("./routes/api/v1/users");

// app.use("/api/v1/user", usersAPI);
app.use("/api/v1/users", users);

PORT = process.env.PORT || 8080;

process.env.PORT
  ? app.listen(PORT, () => {
      console.log(`🖥...Sunny's Server listening on ${PORT}...🖥`);
    })
  : https.createServer(certOptions, app).listen(PORT, () => {
      console.log(`🖥...Sunny's Server listening on ${PORT}...🖥`);
    });

module.exports = app; // for testing
