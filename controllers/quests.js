'use strict';

const debug = require('debug')('team4:controllers:quests');

const questsModel = require('../models/quests.js');

exports.addQuest = (req, res) => {
    debug('add quest');
    let model = questsModel(req.db);
    model.createQuest(req.body.quest).then(
        () => {
            res.status(200).send('Place added successfully');
        },
        error => {
            res.status(400).send(error.message);
        }
    );
};

exports.quest = (req, res) => {
    let questName = req.params.name;
    debug(`get quest ${questName}`);
    let user = req.commonData.user;
    let commonData = {commonData: req.commonData};
    let model = questsModel(req.db);
    if (user) {
        model
            .getTitle(questName)
            .then(model.getQuest)
            .then(quest => {
                console.log(quest);
                let response = Object.assign(quest, commonData);
                res.status(200).renderLayout('./pages/quest/quest.hbs', response);
            })
            .catch(err => res.error(err));
    } else {
        model
            .getTitle(questName)
            .then(model.getQuest)
            .then(quest => {
                console.log(quest);
                let response = Object.assign(quest, commonData);
                res.status(200).renderLayout('./pages/quest/quest.hbs', response);
            })
            .catch(err => res.error(err));
    }
};

exports.likeQuest = (req, res) => {
    let questName = req.params.name;
    debug(`like quest ${questName}`);
    let model = questsModel(req.db);
    let user = req.commonData.user;
    if (!user) {
        res.status(401);
        return;
    }
    model
        .likeQuest(questName, user)
        .then(count => {
            res.status(200).send({count});
        });
};

exports.addCommentToPlace = (req, res) => {
    let name = req.body.name.split('#');
    let questName = name[0];
    let placeName = name[1];
    debug(`add comment to place ${questName}/${placeName}`);
    let author = req.commonData.user;
    let text = req.body.text;
    let model = questsModel(req.db);
    if (!author) {
        res.status(401);
        return;
    }
    let comment = {author, text};
    model
        .addCommentToPlace(questName, placeName, comment)
        .then(() => res.status(200).send(comment));
};

exports.addCommentToQuest = (req, res) => {
    let questName = req.body.name;
    debug(`add comment to quest ${questName}`);
    let author = req.commonData.user;
    let text = req.body.text;
    let model = questsModel(req.db);
    if (!author) {
        res.status(401);
        return;
    }
    let comment = {author, text};
    model
        .addCommentToQuest(questName, comment)
        .then(() => res.status(200).send(comment));
};
