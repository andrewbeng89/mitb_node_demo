var app = require('../app'), http = require('http'), request = require('supertest'), assert = require('assert');

describe('Test Express App', function() {
	it('should GET /', function(done) {
		request(app)
			.get('/index.html')
			.expect(200)
			.end(function(err, res){
        		if (err) return done(err);
        		done();
      		});
	});
});