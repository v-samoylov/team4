'use strict';

const debug = require('debug')('team4:controllers:quests');

const multer = require('multer');
const tr = require('transliteration');
const fs = require('fs');
const flickr = require('../lib/flickr');
const questsModel = require('../models/quests.js');

module.exports.addQuest = (req, res) => {
    debug('add quest');
    questsModel.createQuest(req.body.quest).then(
        () => {
            res.status(200).send('Place added successfully');
        },
        error => {
            res.status(400).send(error.message);
        }
    );
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.statSync('tmp/').isDirectory()) {
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
                        geo: {latitude: 0, longitude: 0}
                    };
                })
            };
            console.log('create quest:', quest);
            return questsModel(req.db).createQuest(quest);
        })
        .then(url => res.redirect(url))
        .catch(err => {
            console.error(err.message);
            res.status(500).send(err.message);
        });
};
