'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const dbConfig = config.get("db");
const mongoUri = `mongodb://{$dbConfig.login}:{$dbConfig.password}@{$dbConfig.host}:{$dbConfig.port}/{$dbConfig.name}`;

module.exports = () => {
    let db;
    return (req, res, next) => {
        if (!db) {
            db = MongoClient.connect(mongoUri, (err, db) => {
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

