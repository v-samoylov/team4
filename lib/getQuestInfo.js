"use strict";

const usersModel = require('../models/users');
const questsModel = require('../models/quests');

module.exports = (db, title, username) => {
    const quests = questsModel(db);
    const users = usersModel(db);
    let data;
    return quests.getQuest(title)
        .then(quest => {
            if (!quest) {
                throw new Error('quest does not exist');
            }
            quest.liked = quest.likes.indexOf(username) > -1;
            quest.likes = quest.likes.length;
            data = quest;
        })
        .then(() => {
            return users.isUserExist(username);
        })
        .then(userCount => {
            if (userCount === 0) {
                throw new Error('Такой пользователь не существует');
            }
            return users.getQuestsInProgress(username);
        })
        .then(quests => {
            data.inProgress = quests.indexOf(title) !== -1;
            return users.getFinishedQuests(username);
        })
        .then(quests => {
            data.finished = quests.indexOf(title) > -1;
            return data;
        });
};
