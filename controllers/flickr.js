"use strict";

const path = require('path');

const env = require('habitat').load('./env.sample');

const Flickr = require('flickrapi');
const FlickrOptions = env.get('FLICKR');

Flickr.authenticate(FlickrOptions, function (error, api) {
    var uploadOptions = {
        photos: [
            {
                title: 'test',
                photo: path.join(__dirname, '/pic.png'),
                tags: ['suc'],
                description: 'desc'
            }
        ]
    };

    Flickr.upload(uploadOptions, FlickrOptions, function (err, result) {
        if (err) {
            console.error('upload error', err);
            return;
        }
        const id = result[0];

        /* eslint camelcase: ["error", {properties: "never"}] */
        api.photos.getInfo({photo_id: id}, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            const photo = res.photo;
            const farmId = photo.farm;
            const serverId = photo.server;
            const id = photo.id;
            const secret = photo.secret;
            let url = `//farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`;
            console.log(url);
        });
    });
});
