'use strict';

const crypto = require('crypto');

let usersCollection;
let salt = 'dreamTeam';

const errors = {
    nameExist: {
        code: 1,
        message: 'Имя уже существует'
    },
    mongoError: {
        code: 2,
        message: 'Ошибка Mongo'
    },
    wrongData: {
        code: 1,
        message: 'Неверные логин/пароль'
    }
};

function getHash(password) {
    return crypto
        .createHmac('sha256', salt)
        .update(password.toString())
        .digest('hex');
}

const login = user => {
    user.password = getHash(user.password);
    return usersCollection
        .find(user)
        .toArray()
        .then(
            result => {
                if (result.length) {
                    return result[0];
                }
                throw errors.wrongData;
            },
            () => {
                throw errors.mongoError;
            }
        );
};

const addUser = newUser => {
    return isNameExist(newUser.name)
        .then(() => {
            newUser.password = getHash(newUser.password);
            newUser.finishedQuests = [];
            newUser.inProgressQuests = [];
            return usersCollection.insertOne(newUser);
        });
};

function addQuestInProgress(name, title) {
    return usersCollection.update({name}, {$push: {inProgressQuests: title}});
}

function removeQuestInProgress(name, title) {
    return usersCollection.update({name}, {$pull: {inProgressQuests: title}});
}

function getQuestsInProgress(name) {
    return usersCollection.find({name})
       .toArray()
       .then(user => user.inProgressQuests);
}

function getFinishedQuests(name) {
    return usersCollection.find({name})
        .toArray()
        .then(user => user.finishedQuests);
}

function questFinish(name, title) {
    return usersCollection.update({name},
        {$pull: {inProgressQuests: title}},
        {$push: {finishedQuests: title}});
}

function isNameExist(newName) {
    return new Promise((resolve, reject) => {
        usersCollection.find({name: newName}).toArray((err, result) => {
            if (err) {
                reject(errors.mongoError);
            } else if (result.length) {
                reject(errors.nameExist);
            } else {
                resolve();
            }
        });
    });
}

const operations = {
    addUser,
    login,
    addQuestInProgress,
    removeQuestInProgress,
    questFinish,
    getQuestsInProgress,
    getFinishedQuests,
    isNameExist
};

module.exports = db => {
    usersCollection = db.collection('users');
    return operations;
};
