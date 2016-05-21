const cookieParser = require('cookie-parser');
const app = require('../../app');

const config = require('config');
const dbConfig = config.get("db");
const MongoClient = require('mongodb').MongoClient;

const mongoUri = `mongodb://${dbConfig.login}:${dbConfig.password}` +
    `@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

var request = require('supertest');
var assert = require('assert');

app.use(cookieParser);
var agent = request.agent(app);

describe('test a user login', function () {
    it('should set an identification cookie on a successful login', function (done) {
        agent
    .post('/user/login')
    .send({email: 'c@c.com', password: 'qwe'})
    .expect(200)
    .expect(function (res) {
        var cookies = res.header['set-cookie'];
        var idCookie = cookies.find(function (cookie) {
            return cookie.substring(0, 2) === 'id';
        });
        assert.ok(idCookie, 'Cookie has not been set');
    }).end(done);
    });
});

describe('test a user registration', function () {
    it('should set an identification cookie on a successful registration', function (done) {
        agent
    .post('/user/reg')
    .send({name: 'testuser' + (new Date()).getTime(), email: 'c@c.com', password: 'qwe'})
    .expect(200)
    .expect(function (res) {
        var cookies = res.header['set-cookie'];
        var idCookie = cookies.find(function (cookie) {
            return cookie.substring(0, 2) === 'id';
        });
        assert.ok(idCookie, 'Cookie has not been set');
    }).end(done);
    });

    it('should add user to the database on a successful registration', function (done) {
        var userName = 'testuser' + (new Date()).getTime();
        var userEmail = 'c@c' + (new Date()).getTime() + '.com';
        agent
    .post('/user/reg')
    .send({name: userName, email: userEmail, password: 'qwe'})
    .expect(200)
    .end(function () {
        MongoClient.connect(mongoUri, (err, db) => {
            if (err) {
                done();
            } else {
                var users = db.collection('users');
                users.find({name: userName, email: userEmail}).toArray().then(result => { // eslint-disable-line
                    assert.equal(result.length, 1, 'User has not been added');
                    done();
                });
            }
        });
    });
    });
});

describe('test a user logout', function () {
    it('should clear the cookie on a logout', function (done) {
        agent
    .post('/user/logout')
    .expect(200)
    .expect(function (res) {
        var cookies = res.header['set-cookie'];
        var idCookie = cookies.find(function (cookie) {
            return cookie.substring(0, 4) === 'id=;';
        });
        assert.ok(idCookie, 'Cookie has not been cleaned');
    })
    .end(done);
    });
});
