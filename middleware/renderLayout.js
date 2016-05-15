'use strict';

const debug = require('debug')('team4:middleware:renderLayout');
const fs = require('fs');

const app = require('../app.js');

module.exports = () => {
    return (req, res, next) => {
        debug('add renderLayout func');
        res.renderLayout = (path, context) => {
            if (!context) {
                context = {};
            }
            let template = app.hbs.handlebars.compile(fs.readFileSync(path, 'utf8'));
            return res.send(template(Object.assign(context, {commonData: req.commonData})));
        };
        next();
    };
};
