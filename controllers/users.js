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

module.exports.loginVK = (req, res) => {
    let userId = hash.create(req.name, salt);
    res.cookie('id', userId, {maxAge: 24 * 60 * 60 * 1000});
    res.redirect('/');
};

module.exports.validate = (req, res, next) => {
    debug('validate');
    if (!req.body.email) {
        res.status(400).send('Введите Email');

        return;
    }

    req.body.email = req.body.email.trim();
    if (!validator.isEmail(req.body.email)) {
        res.status(400).send('Email не валиден');

        return;
    }

    if (!req.body.password) {
        res.status(400).send('Введите пароль');

        return;
    }

    if (req.body.password.length > 30) {
        res.status(400).send('Пароль не валиден');

        return;
    }

    if (req.path === '/user/reg') {
        if (!req.body.name) {
            res.status(400).send('Введине имя');

            return;
        }
        req.body.name = req.body.name.trim();
        if (
            !req.body.name.match(/^[А-яA-z\-0-9]{2,30}$/) ||
            !req.body.name.match(/[А-яA-z]+/)
        ) {
            res.status(400).send('Имя не валидно');

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

    quests.getQuest(title)
        .then(quest => {
            users.addQuestInProgress(user, quest._id)
                .then(() => res.status(200).send({}));
        })
        .catch(err => {
            console.log(err);
            res.status(400);
        });
};
