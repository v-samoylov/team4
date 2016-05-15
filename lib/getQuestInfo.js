'use strict';

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
            quest.places = quest.places.map(place => {
                place.checkIn = place.checkins.indexOf(username) > -1;
                return place;
            });
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
            quests = quests.filter(quest => quest.equals(data._id));
            data.inProgress = quests.length > 0;
            return users.getFinishedQuests(username);
        })
        .then(quests => {
            quests = quests.filter(quest => quest.equals(data._id));
            data.finished = quests.length > 0;
            return data;
        })
        .catch(err => console.error(err));
};
