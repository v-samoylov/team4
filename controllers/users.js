'use strict';

const debug = require('debug')('team4:controllers:users');
const config = require('config');
const validator = require('validator');
const hashConfig = config.get("hash");

const hash = require('../lib/hash.js');
const usersModel = require('../models/users.js');
const questsModel = require('../models/quests.js');

const salt = hashConfig.cookieSalt;

module.exports.logout = (req, res) => {
    debug('logout');
    res.clearCookie('id');
    res.status(200).send('Successfully logged out');
};

module.exports.register = (req, res) => {
    debug('register');
    const users = usersModel(req.db);
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    users.addUser({name, email, password}).then(
        () => {
            let userId = hash.create(name, salt);
            res.cookie('id', userId, {maxAge: 24 * 60 * 60 * 1000});
            res.status(200).send('Registration was successfull');
        },
        error => {
            res.status(400).send(error.message);
        }
    );
};

module.exports.login = (req, res) => {
    debug('login');
    const users = usersModel(req.db);
    let email = req.body.email;
    let password = req.body.password;
    users.login({email, password}).then(
        result => {
            let userId = hash.create(result.name, salt);
            res.cookie('id', userId, {maxAge: 24 * 60 * 60 * 1000});
            res.status(200).send('Successfully logged in');
        },
        error => {
            res.status(400).send(error.message);
        }
    );
};

module.exports.validate = (req, res, next) => {
    debug('validate');
    if (!req.body.email) {
        res.status(400).send({message: 'Email is required', status: 'Error'});
        return;
    }
    req.body.email = req.body.email.trim();
    if (!validator.isEmail(req.body.email)) {
        res.status(400).send({message: 'Email is not valid', status: 'Error'});
        return;
    }
    if (!req.body.password) {
        res.status(400).send({message: 'Password is required', status: 'Error'});
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

module.exports.startQuest = (req, res) => {
    let title = req.body.title;
    debug(`start quest ${title}`);
    const users = usersModel(req.db);
    const quests = questsModel(req.db);
    let user = req.commonData.user;
    let url;
    quests.getQuest(title)
        .then(quest => {
            url = quest.url;
            let img = quest.places[0].img;
            quest.img = img;
            users.addQuestInProgress(user, quest)
                .then(() => res.status(200).send({url}));
        })
        .catch(res.status(400));
};
