
const hash = require('../lib/hash.js');
const config = require('config');
const hashConfig = config.get("hash");
const salt = hashConfig.cookieSalt;

module.exports = () => {
    return (req, res, next) => {
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
