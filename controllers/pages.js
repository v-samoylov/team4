'use strict';
const debug = require('debug')('team4:controllers:pages');
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

function getRandomQuest(quests) {
    return quests[randInt(quests.length)];
}

exports.index = (req, res) => {
    debug('index');
    const quests = questsModel(req.db);
    const allQuests = quests.getAllQuests();
    let choosenQuests = [];
    if (allQuests.length >= 6) {
        choosenQuests = allQuests.slice(0, 6).forEach(filterFields(['url', 'title', 'photo']));
    } else {
        for (let i = 0; i < 6; i++) {
            choosenQuests.push(filterFields(['url', 'title', 'photo'])(getRandomQuest(allQuests)));
        }
    }
    if (res.commonData) {
        res.commonData.quests = choosenQuests;
    } else {
        res.commonData = {quests: choosenQuests};
    }
    res.render('authorization/authorization', {});
};
exports.reg = (req, res) => {
    debug('reg');
    res.render('registration/registration', {});
};

exports.error404 = (req, res) => {
    debug('error404');
    res.status(404).render('notFound/notFound', {});
};
