'use strict';

const questsModel = require('../models/quests.js');

function filterFields(fields) {
    return obj => {
        let resObj = {};
        fields.forEach(field => {
            if (field === 'photo') {
                resObj[field] = getRandomPhoto(obj);
            } else if (obj.hasOwnProperty(field)) {
                resObj[field] = obj[field];
            }
        });
        return resObj;
    };
}

function randInt(range) {
    return Math.floor(Math.random() * range);
}

function getRandomPhoto(quest) {
    return quest.places[randInt(quest.places.length)].photo;
}

function getrRandomQuest(quests) {
    return quests[randInt(quests.length)];
}

module.exports.getQuests = (req, res) => {
    const quests = questsModel(req.db);
    const allQuests = quests.getAllQuests();
    let choosenQuests = [];
    if (allQuests.length >= 6) {
        choosenQuests = allQuests.slice(0, 5).forEach(filterFields(['url', 'title', 'photo']));
    } else {
        for (let i = 0; i < 6; i++) {
            choosenQuests.push(filterFields(['url', 'title', 'photo'])(getrRandomQuest(allQuests)));
        }
    }
    if (req.commonData) {
        req.commonData.quests = choosenQuests;
    } else {
        req.commonData = {quests: choosenQuests};
    }
    res.status(200);
};
