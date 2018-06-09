process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../app");
const knex = require("../../db");
const User = require("../../models/user");

chai.use(chaiHttp);

describe("POST /api/v1/user/new", () => {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));
  it("should create and add an user", done => {
    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send({
        firstName: "Sunny",
        lastName: "Heo",
        email: "sunny@vancouver.com",
        password: "superSecret1@",
        pwMatch: "superSecret1@"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("firstName");
        res.body.firstName.should.equal("Sunny");
        res.body.should.have.property("lastName");
        res.body.lastName.should.equal("Heo");
        res.body.should.have.property("email");
        res.body.email.should.equal("sunny@vancouver.com");
        done();
      });
  });

  it("should throw an error with an invalid property name", done => {
    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send({
        first_name: "Sunny",
        lastName: "Heo",
        email: "sunny@vancouver.com",
        password: "superSecret1@",
        pwMatch: "superSecret1@"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.name.should.equal("ValidationError");
        res.body.should.have.property("type");
        res.body.type.should.equal("ModelValidation");
        res.body.should.have.property("data");
        res.body.data.should.deep.equal({
          firstName: [
            {
              message: "is a required property",
              keyword: "required",
              params: {
                missingProperty: "firstName"
              }
            }
          ]
        });
        res.body.should.have.property("statusCode");
        res.body.statusCode.should.equal(400);
        done();
      });
  });

  it("should throw an error with missing required property", done => {
    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send({
        firstName: "Sunny",
        lastName: "Heo",
        password: "superSecret1@",
        pwMatch: "superSecret1@"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.name.should.equal("ValidationError");
        res.body.should.have.property("type");
        res.body.type.should.equal("ModelValidation");
        res.body.should.have.property("data");
        res.body.data.should.deep.equal({
          email: [
            {
              message: "is a required property",
              keyword: "required",
              params: {
                missingProperty: "email"
              }
            }
          ]
        });
        res.body.should.have.property("statusCode");
        res.body.statusCode.should.equal(400);
        done();
      });
  });

  it("should throw an error: mismatchPassword", done => {
    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send({
        firstName: "Sunny",
        lastName: "Heo",
        email: "sunny@vancouver.com",
        password: "superSecret1!",
        pwMatch: "superSecret1@"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("mismatchPassword");
        res.body.mismatchPassword.should.equal(
          "Passwords do not match, please try again."
        );
        done();
      });
  });

  it("should throw an error: invalidPassword", done => {
    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send({
        firstName: "Sunny",
        lastName: "Heo",
        email: "sunny@.123123123.123123",
        password: "supersecret",
        pwMatch: "supersecret"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("invalidPassword");
        res.body.invalidPassword.should.equal(
          "Password must include one lowercase character, one uppercase character, a number, and a special character."
        );
        done();
      });
  });

  it("should throw an error: invalidEmail", done => {
    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send({
        firstName: "Sunny",
        lastName: "Heo",
        email: "sunny@.123123123.123123",
        password: "superSecret1@",
        pwMatch: "superSecret1@"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.name.should.equal("ValidationError");
        res.body.should.have.property("type");
        res.body.type.should.equal("ModelValidation");
        res.body.should.have.property("data");
        res.body.data.should.deep.equal({
          email: [
            {
              message:
                'should match pattern "^([a-z0-9-_.]+@[a-z0-9-.]+.[a-z]{2,4})$"',
              keyword: "pattern",
              params: {
                pattern: "^([a-z0-9-_.]+@[a-z0-9-.]+.[a-z]{2,4})$"
              }
            }
          ]
        });
        res.body.should.have.property("statusCode");
        res.body.statusCode.should.equal(400);
        done();
      });
  });

  it("should throw an error: duplicateEmail", done => {
    const duplicateUser = {
      firstName: "Sunny",
      lastName: "Heo",
      email: "sunny@admin.com",
      password: "superSecret1@",
      pwMatch: "superSecret1@"
    };

    chai
      .request(server)
      .post("/api/v1/user/new/")
      .send(duplicateUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.name.should.equal("error");
        res.body.should.have.property("detail");
        res.body.detail.should.equal(
          "Key (email)=(sunny@admin.com) already exists."
        );
        done();
      });
  });
});
