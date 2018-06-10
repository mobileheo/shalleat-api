const fs = require("fs"),
  path = require("path"),
  environment = process.env.NODE_ENV || "development",
  logger = require("morgan"),
  express = require("express"),
  https = require("https"),
  bodyParser = require("body-parser"),
  app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app.use(bodyParser.json()).set("json spaces", 2);

const certOptions = {
  key: fs.readFileSync(path.resolve("./encryption/server.key")),
  cert: fs.readFileSync(path.resolve("./encryption/server.crt"))
};

const passport = require("passport");

const users = require("./routes/api/v1/users");

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
