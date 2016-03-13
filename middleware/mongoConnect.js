'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = (mongoUri) => {
    let db;
    mongoUri = mongoUri || 'mongodb://team4:DreamTeam@ds011449.mlab.com:11449/team4hackaton';
    return (req, res, next) => {
        if (!db) {
            db = MongoClient.connect(testUri, (err, db) => {
                if (err) {
                    next(new Error('failed to connect mongo'));
                }
                req.db = db;
                next();
            });
        } else {
            req.db = db;
            next();
        }
    };
};

