const fs = require('fs'),
      path = require('path'),
      knex = require('./db'),
      environment = process.env.NODE_ENV || 'development',
      logger = require('morgan'),
      express = require('express'),
      https = require('https'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      {bcrypt_secrete} = require('./config/authConfig');
      
      
app = express()
      .use(logger('dev'))
      .use(express.static(path.join(__dirname, 'public')))
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(cookieParser())
      .set('json spaces', 2)


const certOptions = {
  key: fs.readFileSync(path.resolve('./encryption/server.key')),
  cert: fs.readFileSync(path.resolve('./encryption/server.crt'))
}

const passport = require('passport'),
  session = require('express-session'),
  KnexSessionStore = require('connect-session-knex')(session);

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions' // optional. Defaults to 'sessions'
});

app.use(session({
    // cookie: {
    //   secure: true,
    //   maxAge: 60000
    // },
    store: store,
    saveUninitialized: true,
    secret: bcrypt_secrete,
    resave: true,
  }))
  .use(passport.initialize())
  .use(passport.session())

passport.serializeUser((user, done) => done(null, user));

app.use((req, res, next) => {
  console.log('isAuthenticated? = ', req.isAuthenticated())
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});


app.get('/', (req, res, next) => {
  console.log('this is user ====> ', req.user)

  // var n = req.session.views || 0
  // req.session.views = ++n;
  // res.end(n + ' views');
  next();
})


PORT = process.env.PORT || 8080;

process.env.PORT ?
  app.listen(PORT, () => {
    console.log(`🖥...Sunny's Server listening on ${PORT}...🖥`)
  }) :
  https.createServer(certOptions, app).listen(PORT, () => {
    console.log(`🖥...Sunny's Server listening on ${PORT}...🖥`)
  })