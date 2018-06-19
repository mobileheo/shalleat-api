const fs = require("fs"),
  path = require("path"),
  environment = process.env.NODE_ENV || "development",
  logger = require("morgan"),
  express = require("express"),
  https = require("https"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  corsOptionsDelegate = require("./config/cors"),
  cookieParser = require("cookie-parser"),
  app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app.use(bodyParser.json()).set("json spaces", 2);

const certOptions = {
  key: fs.readFileSync(path.resolve("./encryption/server.key")),
  cert: fs.readFileSync(path.resolve("./encryption/server.crt"))
};

// const whitelist = ["http://localhost:3000", "http://www.shalleat.com"];
// const corsOptionsDelegate = function(req, callback) {
//   let corsOptions;
//   if (whitelist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

const users = require("./routes/api/v1/users");
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());

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
