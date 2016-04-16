"use strict";

const translit = require('transliteration');
let quests;

const toUrl = title => translit.slugify(title, {lowercase: true, separator: '-'});

const createPlace = place => {
    return {
        title: place.title,
        img: place.img,
        geo: place.geo,
        checkins: 0,
        likes: 0,
        comments: []
    };
};

const isValidPlace = place => {
    if (!place.title) {
        throw new Error('Отсутствует название места');
    }
    if (!place.img) {
        throw new Error('Отсутствует ссылка на изображение');
    }
    if (!place.geo) {
        throw new Error('Отсутствуют данные о геолокации');
    }
    let geo = place.geo;
    if (typeof geo.latitude === 'undefined') {
        throw new Error('Отсутствует широта');
    }
    if (typeof geo.latitude === 'undefined') {
        throw new Error('Отсутствует долгота');
    }
    return true;
};

const isQuestValid = quest => {
    let author = quest.author;
    let title = quest.title;
    let description = quest.description;
    let places = quest.places;
    if (!author) {
        throw new Error('Отсутствует автор');
    }
    if (!title) {
        throw new Error('Отсутствует название квеста');
    }
    if (!description) {
        throw new Error('Отсутствует описание квеста');
    }
    if (Object.prototype.toString.call(places) !== '[object Array]' ||
        places.length === 0) {
        throw new Error('Отсутствует данные о местах');
    }
    places.every(isValidPlace);
};

const isQuestExist = title => {
    return quests.find({title}).next()
        .then(foundQuest => {
            if (foundQuest) {
                throw new Error('Квест с таким именем уже существует');
            }
        });
};

const createQuest = quest => {
    isQuestValid(quest);
    let title = quest.title;
    return isQuestExist(title)
        .then(() => {
            let places = quest.places.map(place => createPlace(place));
            return quests.insert({
                author: quest.author,
                title,
                description: quest.description,
                places,
                url: toUrl(title),
                comments: [],
                likes: 0
            });
        });
};

const addLikeToQuest = title => quests.updateOne({title}, {$inc: {likes: 1}});

// Пока не древовидные
const addCommentToQuest = (title, comment) => {
    return quests.updateOne({title}, {$push: {comments: comment}});
};

const addLikeToPlace = (title, placeTitle) => {
    return quests.updateOne(
        {title, 'places.title': placeTitle},
        {$inc: {'places.$.likes': 1}});
};

const addCheckinToPlace = (title, placeTitle) => {
    return quests.updateOne(
        {title, 'places.title': placeTitle},
        {$inc: {'places.$.checkins': 1}});
};

const addCommentToPlace = (title, placeTitle, comment) => {
    return quests.updateOne(
        {title, 'places.title': placeTitle},
        {$push: {'places.$.comments': comment}});
};

const getAllQuests = () => quests.find({}, {_id: 0}).toArray();

module.exports = db => {
    quests = db.collection('quests');
    return {
        createQuest,
        getAllQuests,
        addLikeToQuest,
        addCommentToQuest,
        addLikeToPlace,
        addCommentToPlace,
        addCheckinToPlace
    };
};
