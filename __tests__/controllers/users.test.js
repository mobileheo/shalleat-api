process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect, should } = chai;
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

const cookieOption = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60
};

chai.use(sinonChai);

let sandbox = null;

describe("UsersController", () => {
  const req = {
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
    },
    cookie: function() {
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
      sandbox.spy(res, "cookie");
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

    it("should return res.cookie with fake token.", async () => {
      sandbox.spy(res, "cookie");
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      UsersController.__set__("createToken", user => "fakeTokenTest");

      await User.query()
        .first()
        .del();

      try {
        await UsersController.signUp(req, res);
        expect(res.cookie).to.have.been.calledWith(
          "ShallEat",
          "fakeTokenTest",
          cookieOption
        );
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          success: "Authorized"
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe("signIn", async () => {
    const user = await User.query().first();
    const req = {
      user,
      value: {
        body: {
          email: "sunny@shalleat.com",
          password: "superSecret1@"
        }
      }
    };

    it("should return cookie when signIn called", async () => {
      sandbox.spy(res, "cookie");
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      try {
        await signIn(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return fake token using rewire", async () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      UsersController.__set__("createToken", user => "fakeTokenTest");

      try {
        await UsersController.signIn(req, res);

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
    it("should return 'this is secret' when called", async () => {
      sandbox.spy(console, "log");
      sandbox.spy(res, "json");

      try {
        await secret(req, res);
        expect(console.log).to.have.been.called;
        expect(res.json).to.have.been.calledWith({ secret: "this is secret" });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
