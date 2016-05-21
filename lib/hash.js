'use strict';

const crypto = require('crypto');

module.exports.validate = (userId, salt) => {
    let userName = userId.substring(0, userId.lastIndexOf('.'));
    return userId === this.create(userName, salt);
};

module.exports.create = (userName, salt) => {
    return userName + '.' + crypto.createHmac('sha256', userName + salt).digest('hex');
};
