process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');
const User = require('../../models/user');

// const config = require('../knexfile.js');

// const knex = require("knex")(config[env]);

const knex = require('../../db')

chai.use(chaiHttp);

beforeEach(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
);

describe('POST /api/v1/user/new', function () {
    it('should create and add an user', function (done) {
        chai.request(server)
            .post('/api/v1/user/new/')
            .send({
                "username": "Sunny",
                "firstName": "Sunny",
                "lastName": "Heo",
                "email": "sunny@vancouver.com",
                "password": "superSecret1@",
                "pwMatch": "superSecret1@"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('username');
                res.body.username.should.equal('Sunny');
                res.body.should.have.property('firstName');
                res.body.firstName.should.equal('Sunny');
                res.body.should.have.property('lastName');
                res.body.lastName.should.equal('Heo');
                res.body.should.have.property('email');
                res.body.email.should.equal('sunny@vancouver.com');
                res.body.should.have.property('provider');
                res.body.provider.should.equal('local');
                done();
            });
    });

    it('should throw an error with an invalid property name', function (done) {
        chai.request(server)
            .post('/api/v1/user/new/')
            .send({
                "username": "Sunny",
                "first_name": "Sunny",
                "lastName": "Heo",
                "email": "sunny@vancouver.com",
                "password": "superSecret1@",
                "pwMatch": "superSecret1@"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.equal('firstName: is a required property');
                done();
            });
    });
    
    it('should throw an error for mismatching passwords', function (done) {
        chai.request(server)
            .post('/api/v1/user/new/')
            .send({	
                "username": "Sunny",
                "firstName": "Sunny",
                "lastName": "Heo",
                "email": "sunny@vancouver.com",
                "password": "superSecret1!",
                "pwMatch": "superSecret1@"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.equal('Passwords do not match, please try again.');
                done();
            });
    });
});