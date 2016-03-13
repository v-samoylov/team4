
const users = require('./controllers/users.js');

module.exports = function (app) {
    app.post('user/login', users.validate);
    app.post('user/login', users.login);
    app.post('user/reg', users.validate);
    app.post('user/reg', users.register);
    app.post('user/logout', users.logout);
};