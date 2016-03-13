'use strict';

const crypto = require('crypto');

const secret = 'r8fjhqa8ds';

module.exports.validate = (userId) => {
    var name = userId.parse('.')[0];
    const hash = name + '.' + crypto.createHmac('sha256', name + secret).digest('hex');
    return hash === UserId;
};

module.exports.create = (name) => {
    return name + '.' + crypto.createHmac('sha256', name + secret).digest('hex');
};
