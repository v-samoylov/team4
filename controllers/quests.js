'use strict';

const debug = require('debug')('team4:controllers:quests');

const multer = require('multer');
const tr = require('transliteration');
const fs = require('fs');
const flickr = require('../lib/flickr');
const questsModel = require('../models/quests.js');

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
    let questName = req.params.name;
    debug(`get quest ${questName}`);
    let user = req.commonData.user;
    let commonData = {commonData: req.commonData};
    let model = questsModel(req.db);
    if (user) {
        model
            .getTitle(questName)
            .then(model.getQuest)
            .then(quest => {
                console.log(quest);
                let response = Object.assign(quest, commonData);
                res.status(200).renderLayout('./pages/quest/quest.hbs', response);
            })
            .catch(err => res.error(err));
    } else {
        model
            .getTitle(questName)
            .then(model.getQuest)
            .then(quest => {
                console.log(quest);
                let response = Object.assign(quest, commonData);
                res.status(200).renderLayout('./pages/quest/quest.hbs', response);
            })
            .catch(err => res.error(err));
    }
};

exports.likeQuest = (req, res) => {
    let questName = req.params.name;
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
            res.status(200).send({count});
        });
};

exports.addCommentToPlace = (req, res) => {
    let name = req.body.name.split('#');
    let questName = name[0];
    let placeName = name[1];
    debug(`add comment to place ${questName}/${placeName}`);
    let author = req.commonData.user;
    let text = req.body.text;
    let model = questsModel(req.db);
    if (!author) {
        res.status(401);
        return;
    }
    let comment = {author, text};
    model
        .addCommentToPlace(questName, placeName, comment)
        .then(() => res.status(200).send(comment));
};

exports.addCommentToQuest = (req, res) => {
    let questName = req.body.name;
    debug(`add comment to quest ${questName}`);
    let author = req.commonData.user;
    let text = req.body.text;
    let model = questsModel(req.db);
    if (!author) {
        res.status(401);
        return;
    }
    let comment = {author, text};
    model
        .addCommentToQuest(questName, comment)
        .then(() => res.status(200).send(comment));
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            fs.accessSync('tmp/', fs.F_OK);
        } catch (e) {
            fs.mkdirSync('tmp/');
        }
        const dir = 'tmp/' + tr.slugify(req.body['title-quest'], {lowercase: true, separator: '-'});
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
        cb(null, fileName + fileType);
    }
});

const upload = multer({storage: storage});

exports.upload = upload.array('input-file-preview');

exports.create = (req, res) => {
    const dir = 'tmp/' + tr.slugify(req.body['title-quest'], {lowercase: true, separator: '-'});
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
            console.log('create quest:', quest);
            return questsModel(req.db).createQuest(quest);
        })
        .then(url => res.send({url: 'quest/' + url}))
        .catch(err => {
            console.error(err.message);
            res.status(500).send(err.message);
        });
};
