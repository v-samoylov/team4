'use strict';

const debug = require('debug')('team4:middleware:mongo');

const config = require('config');
const dbConfig = config.get("db");
const MongoClient = require('mongodb').MongoClient;

const mongoUri = `mongodb://${dbConfig.login}:${dbConfig.password}` +
    `@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

module.exports = () => {
    let connection;

    return (req, res, next) => {
        debug('connecting to db');
        if (connection) {
            req.db = connection;
            next();
        } else {
            connection = MongoClient.connect(mongoUri, (err, db) => {
                if (err) {
                    res.renderLayout('./pages/notFound/notFound.hbs',
                        {text: "Сожелеем, но сервис временно не доступен"});
                } else {
                    connection = db;
                    req.db = connection;
                    next();
                }
            });
        }
    };
};
