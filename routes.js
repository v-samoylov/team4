'use strict';

const pages = require('./controllers/pages');
const users = require('./controllers/users');

module.exports = function (app) {
    app.get('/', pages.index);
    app.post('/user/login', users.validate, users.login);
    app.post('/user/reg', users.validate, users.register);
    app.post('/user/logout', users.logout);
    app.get('/auth', pages.auth);
    app.get('/reg', pages.reg);
    app.get('/get-more-quests', pages.index);
    app.all('*', pages.error404);

    app.use((err, req, res) => {
        console.error(err);
        res.sendStatus(500);
    });
};
