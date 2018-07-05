const fs = require("fs");
const path = require("path");

const key = fs.readFileSync(
  path.resolve(__dirname, "./__encryption/server.key")
);
const cert = fs.readFileSync(
  path.resolve(__dirname, "./__encryption/server.crt")
);

module.exports = {
  certOptions: {
    key,
    cert
  },
  BCRYPT_SSECRET: "[your BCRYPT_SSECRET]",
  JWT_SECRET: "[your JWT_SECRET]",
  GOOGLE_PLACE_API: "your place api key"
};
