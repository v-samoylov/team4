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

exports.index = (req, res) => {
    debug('index');
    const quests = questsModel(req.db);
    let questNum = req.body.hasOwnProperty('skip') ? req.body.skip : 0;
    let choosenQuests = quests.getLimitQuests(questNum, 10);
    choosenQuests = choosenQuests.forEach(filterFields(['url', 'title', 'photo']));
    if (questNum === 0) {
        res.renderLayout('./pages/index/index.hbs',
            {commonData: req.commonData, quests: choosenQuests});
    } else {
        res.json({quests: choosenQuests});
    }
};

exports.auth = (req, res) => {
    debug('auth');
    res.renderLayout('./pages/authorization/authorization.hbs');
};

exports.reg = (req, res) => {
    debug('reg');
    res.renderLayout('./pages/registration/registration.hbs');
};

exports.error404 = (req, res) => {
    debug('error404');
    res.status(404).renderLayout('./pages/notFound/notFound.hbs');
};
