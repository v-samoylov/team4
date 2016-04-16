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
    return usersCollection.find(user).toArray()
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
        newUser.quests = [];
        return usersCollection.insertOne(newUser);
    });
};

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
    addUser: newUser => addUser(newUser),
    login: user => login(user)
};

module.exports = db => {
    usersCollection = db.collection('users');
    return operations;
};
