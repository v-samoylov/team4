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
    return isNameAvalible(newUser.name)
        .then(() => {
            newUser.password = getHash(newUser.password);
            newUser.finishedQuests = [];
            newUser.inProgressQuests = [];
            newUser.createdQuests = [];

            return usersCollection.insertOne(newUser);
        });
};

function addQuestInProgress(name, questId) {
    return usersCollection.update({name}, {$push: {inProgressQuests: questId}});
}

function removeQuestInProgress(name, questId) {
    return usersCollection.update({name}, {$pull: {inProgressQuests: questId}});
}

function getQuestsInProgress(name) {
    return usersCollection.find({name})
       .toArray()
       .then(user => {
           if (user.length) {
               return user[0].inProgressQuests;
           }

           throw new Error('Пользователь не найден');
       });
}

function getFinishedQuests(name) {
    return usersCollection.find({name})
        .toArray()
        .then(user => {
            if (user.length) {
                return user[0].finishedQuests;
            }

            throw new Error('Пользователь не найден');
        });
}

function getPublicUserData(name) {
    return usersCollection.find({name}, {_id: 0, password: 0}).next();
}

function questFinish(name, questId) {
    return usersCollection.update({name},
        {$pull: {inProgressQuests: questId}},
        {$push: {finishedQuests: questId}});
}

function isNameAvalible(newName) {
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

function isUserExist(name) {
    return usersCollection
        .find({name})
        .toArray()
        .then(users => users.length);
}

const operations = {
    addUser,
    login,
    addQuestInProgress,
    removeQuestInProgress,
    questFinish,
    getQuestsInProgress,
    getFinishedQuests,
    isUserExist,
    getPublicUserData
};

module.exports = db => {
    usersCollection = db.collection('users');

    return operations;
};
