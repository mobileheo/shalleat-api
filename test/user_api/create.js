const expect  = require('chai').expect;
const request = require('request');
const {baseURL} = require('../user_api/common_properties')

it('Successful user creation', function(done) {
    request(`${baseURL}/new` , function(error, res, body) {
        
        expect(body).to.equal('Hello World');
        done();
    });
});
