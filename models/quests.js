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
    let title = place.title;
    if (!title) {
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
    if (typeof geo.longitude === 'undefined') {
        throw new Error('Отсутствует долгота');
    }
    return true;
};

/*  eslint quote-props: [1, "as-needed"]*/
const isPlaceExist = (questTitle, placeTitle) => {
    return quests.find({title: questTitle, 'places.title': placeTitle}).next();
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
                likes: []
            });
        });
};

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

const getLimitQuests = (start, offset) => {
    return quests.find({}, {_id: 0}).skip(start).limit(offset).toArray();
};

const getQuest = title => quests.find({title}, {_id: 0}).next();

const removeAllQuests = () => quests.remove({});

const likeQuest = (title, user) => {
    return getQuest(title)
        .then(quest => {
            if (quest.likes.indexOf(user) > -1) {
                return quests.updateOne({title}, {$pull: {likes: user}});
            }
            return quests.updateOne({title}, {$push: {likes: user}});
        });
};

module.exports = db => {
    quests = db.collection('quests');
    return {
        createQuest,
        getQuest,
        getAllQuests,
        likeQuest,
        addCommentToQuest,
        addLikeToPlace,
        addCommentToPlace,
        addCheckinToPlace,
        isPlaceExist,
        getLimitQuests,
        removeAllQuests
    };
};
