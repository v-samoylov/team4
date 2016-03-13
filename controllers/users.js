'use strict';

var validator = require('validator');
var usersModel = require('../models/users.js');
var validator = require('../lib/hash.js');

module.exports.logout = (req, res) => {

};

module.exports.register = (req, res) => {
    var users = usersModel(req.bd);
    var name = res.query.name;
    var email = res.query.email;
    var password = res.query.password;
    users.addUser({name, email, password}).then(
        (result) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).send('Registration is successfull');
        },
        (error) => {
            switch (error.code) {
                case 1:
                    res.status(400).send(error.message);
                    break;
                case 2:
                    res.status(400).send(error.message);
                    break;
            }
            return;
        }
        );
};

module.exports.login = (req, res) => {
    var email = res.query.email;
    var password = res.query.password;
    users.login({email, password}).then(
        (result) => {
            res.status(200).send('Logined successfully');
            var userId = hash.create(name);
            var currTime = new Date();
            res.cookie('id', userId, {expires: currTime + 1000000});
        },
        (error) => {
            switch (error.code) {
                case 1:
                    res.status(400).send(error.message);
                    break;
                case 2:
                    res.status(400).send(error.message);
                    break;
            }
            return;
        }
    );
    next();
};

module.exports.validate = (req, res, next) => {
    var name = res.query.name;
    var email = res.query.email;
    var password = res.query.password;
    if (validator.isEmail(login)) {
        res.sendStatus();
    }
    next();
};
