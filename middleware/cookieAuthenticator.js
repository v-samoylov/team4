'use strict';

const debug = require('debug')('team4:middleware:cookieAuthenticator');

const salt = require('config').get("hash").cookieSalt;

const hash = require('../lib/hash.js');

const userModel = require('../models/users');

module.exports = () => {
    return (req, res, next) => {
        debug('check cookie');
        var userId = req.cookies.id;
        var userMod = userModel(req.db);

        if (userId) {
            var isLoggedIn = hash.validate(userId, salt);
            var userName = userId.substring(0, userId.lastIndexOf('.'));

            if (isLoggedIn) {
                req.commonData.user = userName;
                userMod
                    .getPublicUserData(userName)
                    .then(user => {
                        req.commonData.userUrl = user.url;
                        next();
                    });
            } else {
                next();
            }
        } else {
            next();
        }
    };
};
