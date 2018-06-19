const environment = process.env.NODE_ENV || "development",
  logger = require("morgan"),
  express = require("express"),
  https = require("https"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  corsOptionsDelegate = require("./config/cors"),
  cookieParser = require("cookie-parser"),
  { certOptions } = require("./config/authConfig"),
  app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app.use(bodyParser.json()).set("json spaces", 2);

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
