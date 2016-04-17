'use strict';

const hash = require('../lib/hash.js');
const salt = require('config').get("hash").cookieSalt;
const debug = require('debug')('team4:middleware:cookieAuthenticator');

module.exports = () => {
    return (req, res, next) => {
        debug('check cookie');
        if (req.commonData) {
            req.commonData.user = {};
        } else {
            req.commonData = {user: {}};
        }
        if (res.commonData) {
            res.commonData.user = {};
        } else {
            res.commonData = {user: {}};
        }        
        var userId = req.cookies.id;
        if (userId) {
            var isLoggedIn = hash.validate(userId, salt);
            var userName = userId.split('.')[0];
            if (isLoggedIn) {
                req.commonData.user.name = userName;
                res.commonData.user.name = userName;
            }
        }
        next();
    };
};

