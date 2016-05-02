'use strict';

const debug = require('debug')('team4:middleware:authRequired');

module.exports = (req, res, next) => {
    debug('check auth');
    if (req.commonData.user) {
        next();
    } else {
        res.redirect('/auth');
    }
};
