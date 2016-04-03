'use strict';

const hash = require('../lib/hash.js');
const config = require('config');
const hashConfig = config.get("hash");
const debug = require('debug')('team4:middleware:cookieAuthenticator');
const salt = hashConfig.cookieSalt;

module.exports = () => {
    return (req, res, next) => {
        debug('check cookie');
        req.user = {};
        var userId = req.cookies.id;
        if (userId) {
            var isLoggedIn = hash.validate(userId, salt);
            var userName = userId.split('.')[0];
            if (isLoggedIn) {
                req.user.name = userName;
            }
        }
        next();
    };
};
