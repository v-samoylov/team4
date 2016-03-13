'use strict';

const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');

const should = chai.should();

// Можете объяснить почему требуется специальный фреймворк, чтобы 'should' из 'chai' работал ?
chai.use(require('sinon-chai'));

const mongoConnect = require('../../middleware/mongoConnect');

describe('Tests for mongoConnect.js', () => {
    it('Should check that in req appears key [db] with working internet-connection', done => {
        var actual = mongoConnect();
        var req = {};

        var cb = sinon.spy(actual => {
            actual(req, {}, () => {
                req.should.have.property('db');
                done();
            });
        });

        cb(actual);
        cb.should.have.been.calledOnce;
        cb.should.have.been.calledWith();
    });

    it.skip('Should check that mongoConnect crash on bad url', done => {
        var actual = mongoConnect('mongodb://bad-url');

        var cb = sinon.spy(actual => {
            actual({}, {}, () => {
                done();
            });
        });

        cb(actual);
    });
});
