'use strict';

const debug = require('debug')('team4:middleware:authRequired');

module.exports = (req, res, next) => {
    debug('check auth');
    if (req.commonData.user) {
        if (res.cookie('referrer')) {
            res.cookie('referrer', '', {maxAge: -1});
        }
        next();
    } else {
        res.cookie('referrer', req.url, {maxAge: 60 * 60 * 1000});
        res.redirect('/auth');
    }
};
