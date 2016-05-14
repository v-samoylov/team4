'use strict';

const authRequired = require('./middleware/authRequired');

const pages = require('./controllers/pages');
const users = require('./controllers/users');
const quests = require('./controllers/quests');
const upload = require('./controllers/upload');

module.exports = function (app) {
    app.get('/', pages.index);
    app.get('/get-more-quests', pages.index);
    app.post('/user/login', users.validate, users.login);
    app.post('/user/reg', users.validate, users.register);
    app.post('/user/logout', users.logout);
    app.get('/user/:name', pages.userPage);
    app.get('/auth', pages.auth);
    app.get('/reg', pages.reg);
    app.post('/get-more-quests', pages.index);
    app.get('/quest/:name', quests.quest);
    app.post('/like-quest', authRequired, quests.likeQuest);
    app.post('/place-comment', authRequired, quests.addCommentToPlace);
    app.post('/quest-comment', authRequired, quests.addCommentToQuest);
    app.get('/create-quest', authRequired, pages.createQuest);
    app.post('/upload', authRequired, upload.array, upload.cb);
    app.all('*', pages.error404);

    app.use((err, req, res) => {
        console.error(err);
        res.sendStatus(500);
    });
};
