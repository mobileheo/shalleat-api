process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const faker = require("faker");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");

const User = require("../../models/user");
const { signIn, signUp, secret } = rewire(
  "../../controllers/api/v1/users/users.js"
);

chai.use(sinonChai);

let sandbox = null;
const password = "superSecret1@";
const pwMatch = password;
describe("UsersController", () => {
  let req = {
    user: {
      id: faker.random.number()
    },
    value: {
      body: {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password,
        pwMatch
      }
    }
  };

  let res = {
    json: function() {
      return this;
    },
    status: function() {
      return this;
    }
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("secret", () => {
    it("should return resource when called", async () => {
      sandbox.spy(console, "log");
      sandbox.spy(res, "json");

      try {
        await secret(req, res);
        expect(console.log).to.have.been.called;
        expect(res.json).to.have.been.calledWith({ secret: "resource" });
      } catch (error) {
        console.log(error);
      }
    });
  });
});
