"use strict";

const Flickr = require("flickrapi");
const FlickrOptions = require('config').get('flickr');
const fs = require('fs');

const getPhotoUrl = (id, api) => {
    return new Promise((resolve, reject) => {
        /* eslint camelcase: ["error", {properties: "never"}]*/
        api.photos.getInfo({photo_id: id}, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            const photo = res.photo;
            const farmId = photo.farm;
            const serverId = photo.server;
            const id = photo.id;
            const secret = photo.secret;
            resolve(`//farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`);
        });
    });
};

const removeDir = dir => {
    const removePhoto = photo => {
        return new Promise((resolve, reject) => {
            fs.unlink(photo, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    };
    const photos = fs.readdirSync(dir).map(photo => dir + '/' + photo);
    Promise.all(photos.map(photo => removePhoto(photo)))
        .then(fs.rmdir(dir))
        .catch(err => {
            console.error(err);
            removeDir(dir);
        });
};

module.exports = dir => {
    const photos = fs.readdirSync(dir).map(photo => {
        return {
            title: photo.replace(/(.+)\.\w{3,4}$/, '$1'),
            photo: dir + '/' + photo
        };
    });

    return new Promise((resolve, reject) => {
        Flickr.authenticate(FlickrOptions, function (err, api) {
            if (err) {
                reject(err);
                return;
            }
            Flickr.upload({photos}, FlickrOptions, function (err, result) {
                removeDir(dir);
                if (err) {
                    reject(err);
                    return;
                }
                Promise.all(result.map(id => getPhotoUrl(id, api)))
                    .then(resolve)
                    .catch(reject);
            });
        });
    });
};
