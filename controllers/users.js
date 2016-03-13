'use strict';

var validator = require('validator');
var usersModel = require('../models/users.js');
var hash = require('../lib/hash.js');

module.exports.logout = (req, res) => {
};

module.exports.register = (req, res, next) => {
    var users = usersModel(req.db);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    users.addUser({name, email, password}).then(
        (result) => {
            res.status(200).send('Registration was successfull');
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

module.exports.login = (req, res, next) => {
    var users = usersModel(req.db);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    users.login({email, password}).then(
        (result) => {
            res.status(200).send('Successfully logged in');
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
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    if (!validator.isEmail(email)) {
        res.status(200).send({message: 'Wrong email', status: 'error'});
        return;
    }
    next();
};

