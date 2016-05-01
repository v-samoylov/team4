'use strict';

const debug = require('debug')('team4:controllers:pages');

const questsModel = require('../models/quests');
const randInt = require('../lib/random').randInt;

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

function getRandomPhoto(quest) {
    return quest.places[randInt(quest.places.length)].img;
}

exports.index = (req, res) => {
    debug('index');
    const quests = questsModel(req.db);
    let questNum = req.body.hasOwnProperty('skip') ? req.body.skip : 0;
    quests.getLimitQuests(questNum, 10).then(chosenQuests => {
        chosenQuests = chosenQuests.map(filterFields(['url', 'title', 'photo']));
        if (questNum === 0) {
            res.renderLayout('./pages/index/index.hbs',
                {quests: chosenQuests, commonData: req.commonData});
        } else {
            res.json({quests: chosenQuests});
        }
    });
};

exports.userPage = (req, res) => {
    debug('userPage');
    if (req.commonData.user === req.params.name) {
        res.render('userPage/userPage', {commonData: req.commonData});
    } else {
        res.message('no access').sendStatus(403);
    }
};

exports.auth = (req, res) => {
    debug('auth');
    res.renderLayout('./pages/authorization/authorization.hbs', {commonData: req.commonData});
};

exports.createQuest = (req, res) => {
    debug('createQuest');
    res.renderLayout('./pages/createQuest/createQuest.hbs');
};

exports.reg = (req, res) => {
    debug('reg');
    res.renderLayout('./pages/registration/registration.hbs', {commonData: req.commonData});
};

exports.error404 = (req, res) => {
    debug('error404');
    res.status(404).renderLayout('./pages/notFound/notFound.hbs', {commonData: req.commonData});
};
