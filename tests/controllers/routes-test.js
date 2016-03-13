'use strict';

const request = require('supertest');
const app = require('../../app');

describe("routes test", () => {
    it('should reply with 404 error on nonexistent links', done => {
        request(app)
            .get('/nonexistent-url')
            .expect(404, done);
    });
});
