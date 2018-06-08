process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../app");
const knex = require("../../db");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

const adminUser = {
  firstName: "Sunny",
  lastName: "Heo",
  email: "sunny@admin.com",
  password: "superSecret1@",
  provider: "local"
};

chai.use(chaiHttp);

// beforeEach(() =>
//   knex.migrate
//     .rollback()
//     .then(() => knex.migrate.latest())
//     .then(() => knex.seed.run()));

describe("POST /api/v1/user/login", () => {
  bcrypt.hash(adminUser.password, 10, async function(err, password) {
    try {
      adminUser.password = password;
      const user = await User.query().insert(adminUser);
      return user;
    } catch (error) {
      // console.log(error);
    }
  });

  it("should authorize a valid user", done => {
    chai
      .request(server)
      .post("/api/v1/user/login/")
      .send({
        email: "sunny@admin.com ",
        password: "superSecret1@"
      })
      .end((err, res) => {
        console.log(res);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("user_id");
        done();
      });
  });

  it("should unauthorize an invalid user", done => {
    chai
      .request(server)
      .post("/api/v1/user/login/")
      .send({
        email: "sunny@admin.com",
        password: "superSecret1!"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal("Unauthorized");
        done();
      });
  });
});
