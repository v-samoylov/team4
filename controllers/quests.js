'use strict';

const debug = require('debug')('team4:controllers:quests');

const fs = require('fs');
const crypto = require('crypto');
const tr = require('transliteration');
const multer = require('multer');
const geolib = require('geolib');

const flickr = require('../lib/flickr');
const questsModel = require('../models/quests.js');
const questInfo = require('../lib/getQuestInfo');
const userModel = require('../models/users.js');

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
    let questUrl = req.params.name;
    debug(`get quest ${questUrl}`);
    let user = req.commonData.user;
    let commonData = {commonData: req.commonData};
    let model = questsModel(req.db);

    if (user) {
        model
            .getTitle(questUrl)
            .then(questName => questInfo(req.db, questName, user))
            .then(quest => {
                let response = Object.assign(quest, commonData);

                res.status(200).renderLayout('./pages/quest/quest.hbs', response);
            })
            .catch(err => res.error(err));
    } else {
        model
            .getTitle(questUrl)
            .then(model.getQuest)
            .then(quest => {
                let response = Object.assign(quest, commonData);

                res.status(200).renderLayout('./pages/quest/quest.hbs', response);
            })
            .catch(err => res.error(err));
    }
};

exports.likeQuest = (req, res) => {
    let questName = req.body.title;
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
            console.log(count);
            res.status(200).send({count});
        })
        .catch(err => console.error(err));
};

exports.addCommentToPlace = (req, res) => {
    let name = req.body.name.split('#');
    let questName = name[0];
    let placeName = name[1];
    debug(`add comment to place ${questName}/${placeName}`);
    let author = req.commonData.user;
    let text = req.body.text;
    let model = questsModel(req.db);
    let userMod = userModel(req.db);
    if (!author) {
        res.status(401);

        return;
    }

    let comment = {author, text};
    userMod
        .getPublicUserData(author)
        .then(user => {
            comment.url = user.url;

            return model.addCommentToPlace(questName, placeName, comment);
        })
        .then(() => res.status(200).send(comment))
        .catch(err => console.error(err));
};

exports.addCommentToQuest = (req, res) => {
    let questName = req.body.name;
    debug(`add comment to quest ${questName}`);
    let author = req.commonData.user;
    let text = req.body.text;
    let model = questsModel(req.db);
    let userMod = userModel(req.db);

    if (!author) {
        res.status(401);

        return;
    }

    let comment = {author, text};

    userMod
        .getPublicUserData(author)
        .then(user => {
            comment.url = user.url;
            return model.addCommentToQuest(questName, comment);
        })
        .then(() => res.status(200).send(comment))
        .catch(err => console.error(err));
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            fs.accessSync('tmp/', fs.F_OK);
        } catch (e) {
            fs.mkdirSync('tmp/');
        }

        const dir = 'tmp/' + crypto.createHash('md5').update(
                tr.slugify(req.body['title-quest'], {lowercase: true, separator: '-'})
            ).digest('hex');

        fs.mkdir(dir, e => {
            if (!e || (e && e.code === 'EEXIST')) {
                cb(null, dir);
            } else {
                console.error(e);
            }
        });
    },
    filename: (req, file, cb) => {
        let fileNumber = req.fileNumber;

        if (fileNumber) {
            ++req.fileNumber;
        } else {
            fileNumber = 0;
            req.fileNumber = 1;
        }

        const titles = req.body['title-place'];

        let fileName;

        if (Array.isArray(titles)) {
            fileName = req.body['title-place'][fileNumber];
        } else {
            fileName = req.body['title-place'];
        }

        const fileType = file.originalname.replace(/.+(\.\w{3,4})$/, '$1');

        cb(null, fileNumber + '_' +
            crypto.createHash('md5').update(fileName).digest('hex') + fileType);
    }
});

const upload = multer({storage: storage});

exports.upload = upload.array('input-file-preview');

exports.create = (req, res) => {
    debug('create');
    const dir = 'tmp/' + crypto.createHash('md5').update(
            tr.slugify(req.body['title-quest'], {lowercase: true, separator: '-'})
        ).digest('hex');

    flickr(dir)
        .then(urls => {
            const body = req.body;

            let geo = body['geo-place'];

            if (!Array.isArray(geo)) {
                geo = [geo];
            }

            geo = geo.map(str => {
                const positions = str.split(',');

                return {
                    latitude: positions[0],
                    longitude: positions[1]
                };
            });

            console.log(geo);
            let placeTitle = body['title-place'];

            if (!Array.isArray(placeTitle)) {
                placeTitle = [placeTitle];
            }

            const quest = {
                author: req.commonData.user,
                title: body['title-quest'],
                description: body['desc-quest'],
                places: placeTitle.map((title, i) => {
                    return {
                        title,
                        img: urls[i],
                        geo: geo[i]
                    };
                })
            };

            debug('create quest:', quest);
            return questsModel(req.db).createQuest(quest);
        })
        .then(data => {
            userModel(req.db).addCreatedQuest(req.commonData.user, data.id)
                .then(() => res.send({url: 'quest/' + data.url}));
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send(err.message);
        });
};

exports.checkin = (req, res) => {
    debug(`checkIn`);
    const model = questsModel(req.db);
    const userMod = userModel(req.db);
    let name = req.body.name.split('#');
    let questName = name[0];
    let placeName = name[1];
    let userLatitude = parseFloat(req.body.latitude);
    let userLongitude = parseFloat(req.body.longitude);
    let id;

    model.getQuest(questName)
        .then(quest => {
            id = quest._id;
            quest.places.find(place => place.title === placeName);
        })
        .then(place => {
            let distance = geolib.getDistance(
                {latitude: userLatitude, longitude: userLongitude},
                {latitude: place.geo.latitude, longitude: place.geo.longitude}
            );

            if (distance > 30) {
                res.status(400).send('Вы слишком далеко от места');

                return;
            }

            model
                .addCheckinToPlace(questName, placeName, req.commonData.user)
                .then(res => {
                    if (res.isFinished) {
                        userMod.questFinish(req.commonData.user, id);
                    }
                    res.status(200).send(res);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
};
