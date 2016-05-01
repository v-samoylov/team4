'use strict';

const pages = require('./controllers/pages');
const users = require('./controllers/users');

module.exports = function (app) {
    app.get('/', pages.index);
    app.post('/user/login', users.validate, users.login);
    app.post('/user/reg', users.validate, users.register);
    app.post('/user/logout', users.logout);
    app.get('/get-more-quests', pages.index);
    app.get('/user/:name', pages.userPage);
    app.get('/auth', pages.auth);
    app.get('/reg', pages.reg);
    app.all('*', pages.error404);

    app.use((err, req, res) => {
        console.error(err);
        res.sendStatus(500);
    });
};
