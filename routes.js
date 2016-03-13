const users = require('./controllers/users.js');
const pages = require('./controllers/pages');

module.exports = function (app) {
    app.post('user/login', users.validate);
    app.post('user/login', users.login);
    app.post('user/reg', users.validate);
    app.post('user/reg', users.register);
    app.post('user/logout', users.logout);
    app.get('/', pages.index);
    app.get('/reg', pages.reg);
    app.all('*', pages.error404);

    app.use((err, req, res, next) => {
        console.error(err);
        res.sendStatus(500);
    });
};
