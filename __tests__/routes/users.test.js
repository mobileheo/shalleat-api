process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const faker = require("faker");
const server = require("../../app");
const knex = require("../../db");

chai.use(chaiHttp);
let header;
describe("User route", () => {
  const PATH = "/api/v1/users";
  const signUp = `${PATH}/signup`;
  const signIn = `${PATH}/signin`;
  const secret = `${PATH}/secret`;
  const password = "superSecret1@";
  const pwMatch = password;

  const preSavedUser = {
    email: faker.internet.email(),
    firstName: "Sunny",
    lastName: "Heo",
    password,
    pwMatch
  };

  const newUser = {
    email: "sunny@gmail.com",
    firstName: "Sunny",
    lastName: "Heo",
    password,
    pwMatch
  };

  before(async () => {
    try {
      const res = await chai
        .request(server)
        .post(signUp)
        .send(preSavedUser);

      expect(res.status).to.equal(200);

      header = res.header;
    } catch (error) {
      throw new Error(error);
    }
  });

  after("dropping test db", async () => {
    try {
      await knex.migrate.rollback();
      await knex.migrate.latest();
      console.log("Rollback database");
    } catch (error) {
      throw new Error(error);
    }
  });
  describe("signup", () => {
    it("should create new user with cookie if given email not found on db", async () => {
      try {
        const res = await chai
          .request(server)
          .post(signUp)
          .send(newUser);

        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("provider");
        expect(res.headers).to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return 403 and not set cookie if the given email is already in db", async () => {
      try {
        const res = await chai
          .request(server)
          .post(signUp)
          .send(preSavedUser);
        expect(res).to.be.json;
        expect(res).to.have.status(422);
        expect(res.body).to.be.an("object");
        expect(res.body).to.deep.equal({ error: "Email is already in use" });
        expect(res.headers).not.to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return 400 and not set cookie if password mismatches", async () => {
      try {
        const invalidUser = { ...newUser, pwMatch: "NotMatch1@" };
        const res = await chai
          .request(server)
          .post(signUp)
          .send(invalidUser);

        expect(res).to.be.json;
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.deep.equal({
          error: "Passwords do not match, please try again."
        });
        expect(res.headers).not.to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return 400 and not set cookie if password is invalid", async () => {
      try {
        const invalidUser = { ...newUser, pwMatch: "Invalid" };
        const res = await chai
          .request(server)
          .post(signUp)
          .send(invalidUser);

        expect(res).to.be.json;
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("name", "ValidationError");
        expect(res.headers).not.to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe("signin", () => {
    it("should return error 400 and not set cookie if user email and password empty", async () => {
      let user = {};
      try {
        const res = await chai
          .request(server)
          .post(signIn)
          .send(user);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text)).to.have.property(
          "name",
          "ValidationError"
        );
        expect(JSON.parse(res.text)).to.have.property("details");
        expect(JSON.parse(res.text).details).to.deep.equal([
          {
            message: '"email" is required',
            path: ["email"],
            type: "any.required",
            context: {
              key: "email",
              label: "email"
            }
          }
        ]);
        expect(res.headers).not.to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return error 400 and not set cookie if user password empty", async () => {
      const { email } = preSavedUser;
      const user = { email };
      try {
        const res = await chai
          .request(server)
          .post(signIn)
          .send(user);

        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text)).to.have.property(
          "name",
          "ValidationError"
        );
        expect(JSON.parse(res.text)).to.have.property("details");
        expect(JSON.parse(res.text).details).to.deep.equal([
          {
            message: '"password" is required',
            path: ["password"],
            type: "any.required",
            context: {
              key: "password",
              label: "password"
            }
          }
        ]);
        expect(res.headers).not.to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return error 400 and not set cookie if user email empty", async () => {
      const { password } = preSavedUser;
      const user = { password };
      try {
        const res = await chai
          .request(server)
          .post(signIn)
          .send(user);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text)).to.have.property(
          "name",
          "ValidationError"
        );
        expect(JSON.parse(res.text)).to.have.property("details");
        expect(JSON.parse(res.text).details).to.deep.equal([
          {
            message: '"email" is required',
            path: ["email"],
            type: "any.required",
            context: {
              key: "email",
              label: "email"
            }
          }
        ]);
        expect(res.headers).not.to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return 200 and cookie if given email and password valid ", async () => {
      try {
        const { email, password } = preSavedUser;
        const userInput = { email, password };
        const res = await chai
          .request(server)
          .post(signIn)
          .send(userInput);

        expect(res.status).to.be.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property("provider");
        expect(res.headers).to.have.property("set-cookie");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return 401 if user password not match", async () => {
      try {
        const { email } = preSavedUser;
        const password = "fakePassword!@";
        const userInput = { email, password };
        const res = await chai
          .request(server)
          .post(signIn)
          .send(userInput);

        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.empty;
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe("secret", () => {
    it("should return status 401 if no cookie provided", async () => {
      try {
        const res = await chai.request(server).get(secret);

        expect(res.status).to.equal(401);
        expect(res.text).to.equal("Unauthorized");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return status 401 if invalid cookie provided", async () => {
      try {
        const [cookie] = header["set-cookie"];
        const res = await chai
          .request(server)
          .get(secret)
          .set("Cookie", "invalid");

        expect(res.status).to.equal(401);
        expect(res.text).to.equal("Unauthorized");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("should return status 200 if valid cookie provided", async () => {
      try {
        const [cookie] = header["set-cookie"];
        const res = await chai
          .request(server)
          .get(secret)
          .set("Cookie", cookie);

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ secret: "this is secret" });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
