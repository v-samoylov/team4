'use strict';

var validator = require('validator');
var usersModel = require('../models/users.js');
var hash = require('../lib/hash.js');
const config = require('config');
const debug = require('debug')('team4:controllers:users');
const hashConfig = config.get("hash");
const salt = hashConfig.cookieSalt;

const config = require('config');
const hashConfig = config.get("hash");
const salt = hashConfig.cookieSalt;

module.exports.logout = (req, res) => {
    debug('logout');
    res.clearCookie('id');
    res.status(200).send('Successfully logged out');
    
};

module.exports.register = (req, res) => {
    debug('register');
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
    debug('login');
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
    if (!req.body.password) {
        res.status(400).send({message: 'Password is required', status: 'Error'});
        return;
    }
    if (!req.body.email) {
        res.status(400).send({message: 'Email is required', status: 'Error'});
        return;
    }
    req.body.email = req.body.email.trim();
    if (!validator.isEmail(req.body.email)) {
        res.status(400).send({message: 'Email is not valid', status: 'Error'});
        return;
    }
    if (req.body.password.length > 30) {
        res.status(400).send({message: 'Password is not valid', status: 'Error'});
        return;
    }
    if (req.path === '/user/reg') {
        if (!req.body.name) {
            res.status(400).send({message: 'Name is required', status: 'Error'});
            return;
        }
        req.body.name = req.body.name.trim();
        if (
            !req.body.name.match(/^[А-яA-z\-0-9]{2,30}$/) ||
            !req.body.name.match(/[А-яA-z]+/)
        ) {
            res.status(400).send({message: 'Name is not valid', status: 'Error'});
            return;
        }
    }
    next();
};
