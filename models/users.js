'use strict';
const crypto = require('crypto');
let usersCollection;
let salt = 'dreamTeam';

const errors = {
    nameExist: {
        code: 1,
        messege: 'Имя уже существует'
    },
    mongoError: {
        code: 2,
        messege: 'Ошибка Mongo'
    },
    wrongData: {
        code: 1,
        messege: 'Неверные логин/пароль'
    }
};

const login = user => {
    return new Promise((resolve, reject) => {
        user.password = getHash(user.password);
        usersCollection.find(user).toArray((err, result) => {
            if (err) {
                reject(errors.mongoError);
            }
            if (result.length) {
                resolve(result[0]);
            } else {
                reject(errors.wrongData);
            }
        });
    });
};

const addUser = newUser => {
    return new Promise((resolve, reject) => {
        isNameExist(newUser.name).then(
            exist => {
                if (exist) {
                    reject(errors.nameExist);
                }
                newUser.password = getHash(newUser.password);
                usersCollection.insertOne(newUser, err => {
                    if (err) {
                        reject(errors.mongoError);
                    }
                    resolve();
                });
            },
            () => reject(errors.mongoError)
        );
    });
};

const operations = {
    addUser: newUser => addUser(newUser),
    login: user => login(user)
};

module.exports = db => {
    usersCollection = db.collection('users');
    return operations;
};

function isNameExist(newName) {
    return new Promise((resolve, reject) => {
        usersCollection.find({name: newName}).toArray((err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.length);
        });
    });
}

function getHash(password) {
    return crypto
        .createHmac('sha256', salt)
        .update(password)
        .digest('hex');
}
