'use strict';

const debug = require('debug')('team4:controllers:vk');

const request = require('request-promise');

const usersModel = require('../models/users.js');

module.exports.auth = (req, res, next) => {
    debug('auth');
    if (req.query.code) {
        let userInfo = {};
        let users = usersModel(req.db);

        request({
            uri: uriAccessToken(req.commonData.isDev, req.query.code),
            transform: JSON.parse
        })
        .then(body => {
            Object.assign(userInfo, {userId: body.user_id, email: body.email});
            request({
                uri: uriUserInfo(body.user_id, body.access_token),
                transform: JSON.parse
            })
            .then(body => {
                Object.assign(userInfo, {name: body.response[0].domain});
                return userInfo;
            })

            .then(users.loginVK)

            .then(result => {
                req.name = result.name;
                next();
            })
            .catch(err => {
                console.error(err);
                res.renderLayout('./pages/notFound/notFound.hbs', {text: err});
            });
        })
        .catch(err => {
            console.error(err);
            res.renderLayout('./pages/notFound/notFound.hbs', {text: err});
        });
    } else {
        res.renderLayout('./pages/notFound/notFound.hbs');
    }
};

function uriUserInfo(userId, accessToken) {
    return 'https://api.vk.com/method/users.get' +
        '?fields=domain&user_id=' + userId + '&v=5.52&access_token=' + accessToken;
}

function uriAccessToken(isDev, code) {
    let redirectUri = 'http://' + (isDev ?
            'localhost:3000' : 'dream-team-4.herokuapp.com') + '/auth-vk';
    return 'https://oauth.vk.com/access_token?' +
        'client_id=5471140&client_secret=ydvR6wzaC6IHyMMJYawU&' +
        'redirect_uri=' + redirectUri + '&code=' + code;
}

