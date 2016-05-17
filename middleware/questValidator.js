"use strict";

const questsModel = require('../models/quests');

module.exports = () => {
    return (req, res, next) => {
        debug('quest validator');
        
        const quests = questsModel(req.db);
        console.log(req.body);
        // quests.isQuestValid()
        
        // next();
    };
};
