'use strict';

var validator = require('validator');
var usersModel = require('../models/users.js');
var hash = require('../lib/hash.js');
const config = require('config');
const hashConfig = config.get("hash");
const salt = hashConfig.cookieSalt;

module.exports.logout = (req, res) => {
    res.clearCookie('id');
    res.status(200).send('Successfully logged out');
};

module.exports.register = (req, res) => {
    const users = usersModel(req.db);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    users.addUser({name, email, password}).then(
        () => {
            res.status(200).send('Registration was successfull');
        },
        error => {
            res.status(error.code).send(error.message);
        }
    );
};

module.exports.login = (req, res) => {
    const users = usersModel(req.db);
    var email = req.body.email;
    var password = req.body.password;
    users.login({email, password}).then(
        result => {
            var userId = hash.create(result.name, salt);
            res.cookie('id', userId, {maxAge: 1000000});
            res.status(200).send('Successfully logged in');
        },
        error => {
            res.status(error.code).send(error.message);
        }
    );
};

module.exports.validate = (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        res.status(200).send({message: 'Wrong email', status: 'Error'});
        return;
    }
    next();
};
