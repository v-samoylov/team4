'use strict';

var validator = require('validator');
var usersModel = require('../models/users.js');
var hash = require('../lib/hash.js');

module.exports.logout = (req, res) => {
    res.clearCookie('id');
    res.status(200).send('Successfully logged out');
};

module.exports.register = (req, res) => {
    var users = usersModel(req.db);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    users.addUser({name, email, password}).then(
        result => {
            res.status(200).send('Registration was successfull');
            req.user = {};
            req.user.name = result.name;
            req.user.email = result.email;
        },
        error => {
            switch (error.code) {
                case 1:
                    res.status(400).send(error.message);
                    break;
                case 2:
                    res.status(500).send(error.message);
                    break;
                default:
                    res.status(500).send(error.message);
                    break;
            }
            return;
        }
    );
};

module.exports.login = (req, res) => {
    var users = usersModel(req.db);
    var email = req.body.email;
    var password = req.body.password;
    users.login({email, password}).then(
        result => {
            var userId = hash.create(result.name);
            res.cookie('id', userId, {maxAge: 1000000});
            res.status(200).send('Successfully logged in');
        },
        error => {
            switch (error.code) {
                case 1:
                    res.status(400).send(error.message);
                    break;
                case 2:
                    res.status(500).send(error.message);
                    break;
                default:
                    res.status(500).send(error.message);
                    break;
            }
            return;
        }
    );
};

module.exports.validate = (req, res, next) => {
    var email = req.body.email;
    if (!validator.isEmail(email)) {
        res.status(200).send({message: 'Wrong email', status: 'error'});
        return;
    }
    next();
};
