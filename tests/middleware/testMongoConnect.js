'use strict';

const chai = require('chai');
const sinon = require('sinon');

/* eslint no-unused-vars: 0*/
const should = chai.should();

chai.use(require('sinon-chai'));

const mongoConnect = require('../../middleware/mongoConnect');

describe('Tests for mongoConnect.js', () => {
    it('Should check that in req appears key [db] with working internet-connection', done => {
        var actual = mongoConnect();
        var req = {};
        var cb = sinon.spy(actual => {
            actual(req, {}, () => {
                req.should.have.property('db');
                req.db.close();
                done();
            });
        });
        cb(actual);
        /* eslint no-unused-expressions: 0*/
        cb.should.have.been.calledOnce;
        cb.should.have.been.calledWith();
    });

    /* eslint max-nested-callbacks: [2, 5]*/
    it('Should check that returns same db for multiple requests', done => {
        var actual = mongoConnect();
        var req = {};
        var _db;
        var cb = sinon.spy(conn => {
            conn(req, {}, () => {
                _db = req.db;

                actual(req, {}, () => {
                    _db.should.equal(req.db);
                    req.db.close();
                    done();
                });
            });
        });
        cb(actual);
        /* eslint no-unused-expressions: 0*/
        cb.should.have.been.calledOnce;
        cb.should.have.been.calledWith();
    });
});
