process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const faker = require("faker");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");
const knex = require("../../db");

const { User } = require("../../models/schema");
const UsersController = rewire("../../controllers/api/v1/users/users.js");

const { signIn, signUp, secret } = rewire(
  "../../controllers/api/v1/users/users.js"
);

chai.use(sinonChai);

let sandbox = null;

describe("UsersController", () => {
  let req = {
    user: {
      id: faker.random.number()
    },
    value: {
      body: {
        email: "sunny@shalleat.com",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: "superSecret1@"
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

  describe("signUp", () => {
    it("should return 200 if user is not in db and it is successfully saved", async () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      try {
        await signUp(req, res);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return 403 if the user is already in the db.", async () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      try {
        await signUp(req, res);

        expect(res.status).to.have.been.calledWith(403);
        expect(res.json).to.have.been.calledWith({
          error: "Email is already in use"
        });
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return res.json with fake token.", async () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      const createToken = UsersController.__set__(
        "createToken",
        user => "fakeTokenTest"
      );

      await User.query()
        .first()
        .del();

      try {
        await UsersController.signUp(req, res);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          token: "fakeTokenTest"
        });
      } catch (error) {
        throw new Error(error);
      }
    });
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
        throw new Error(error);
      }
    });
  });
});
