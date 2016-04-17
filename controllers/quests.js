'use strict';

const debug = require('debug')('team4:controllers:quests');
const questsModel = require('../models/quests.js');

module.exports.addQuest = (req, res) => {
    debug();
    questsModel.createQuest(req.body.quest).then(
        () => {
            res.status(200).send('Place added successfully');
        },
        error => {
            res.status(400).send(error.message);
        }
    )
};
