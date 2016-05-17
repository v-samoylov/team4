'use strict';

const translit = require('transliteration');

let quests;

const toUrl = title => translit.slugify(title, {lowercase: true, separator: '-'});

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

/*  eslint quote-props: [1, "as-needed"] */
const isPlaceExist = (questTitle, placeTitle) => {
    return quests.findOne({title: questTitle, 'places.title': placeTitle});
};

const createPlace = place => {
    return {
        title: place.title,
        img: place.img,
        geo: place.geo,
        checkins: [],
        likes: [],
        comments: []
    };
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

    if (!Array.isArray(places) ||
        places.length === 0) {
        throw new Error('Отсутствует данные о местах');
    }

    places.every(isValidPlace);

    const placeTitles = places.map(place => place.title);

    const repeatPlaceTitle = placeTitles.find((title, i) => {
        return placeTitles.slice(i + 1).indexOf(title) > -1;
    });

    if (repeatPlaceTitle) {
        throw new Error('Название места "' + repeatPlaceTitle + '" не уникально');
    }
};

const isQuestExist = title => {
    return quests.findOne({title})
        .then(foundQuest => {
            if (foundQuest) {
                throw new Error('Квест с таким именем уже существует');
            }
        });
};

const createQuest = quest => {
    let title = quest.title;

    return isQuestExist(title)
        .then(() => {
            isQuestValid(quest);

            let places = quest.places.map(place => createPlace(place));

            return quests.insert({
                author: quest.author,
                title,
                description: quest.description,
                places,
                url: toUrl(title),
                comments: [],
                likes: [],
                likesCount: 0
            });
        })
        .then(res => res.ops[0].url);
};

const addCommentToPlace = (title, placeTitle, comment) => {
    return quests.updateOne(
        {title, 'places.title': placeTitle},
        {$push: {'places.$.comments': comment}}
    );
};

const addCommentToQuest = (title, comment) => {
    return quests.updateOne({title}, {$push: {comments: comment}});
};

const getAllQuests = () => quests.find({}, {_id: 0}).toArray();

const removeAllQuests = () => quests.remove({});

const removeQuest = title => quests.remove({title});

const getQuest = title => quests.find({title}).next();

const getQuestsById = ids => quests.find({_id: {$in: ids}}).toArray();

const getLimitQuests = (skip, limit) => {
    return quests.find({}, {_id: 0}).skip(skip).limit(limit).toArray();
};

const getLimitQuestsSorted = (skip, limit, field) => {
    var res = quests.find({}, {_id: 0});

    if (field) {
        var sortObj = {};

        sortObj[field] = -1;
        console.log('sorted');

        return res.sort(sortObj).skip(skip).limit(limit).toArray();
    }

    return res.skip(skip).limit(limit).toArray();
};

const likeQuest = (title, user) => {
    return getQuest(title)
        .then(quest => {
            const options = {returnOriginal: false};

            if (quest.likes.indexOf(user) > -1) {
                return quests.findOneAndUpdate({title}, {$pull: {likes: user}}, options);
            }

            return quests.findOneAndUpdate({title}, {$push: {likes: user}}, options);
        })
        .then(res => {
            quests.updateOne(
                {title},
                {$set: {likesCount: res.value.likes.length}}
            );

            return res.value.likes.length;
        });
};

const addCheckinToPlace = (title, placeTitle, user) => {
    return getQuest(title)
        .then(quest => {
            if (!quest) {
                console.error('Нет квеста с названием ' + title);
                throw new Error('Нет квеста с названием ' + title);
            }

            const place = quest.places.find(place => place.title === placeTitle);

            if (!place) {
                console.error('В квесте нет места с названием ' + placeTitle);
                throw new Error('В квесте нет места с названием ' + placeTitle);
            }

            if (place.checkins.indexOf(user) > -1) {
                console.error('Вы уже зачекинены');
                throw new Error('Вы уже зачекинены');
            }

            return quests.findOneAndUpdate(
                {title, 'places.title': placeTitle},
                {$push: {'places.$.checkins': user}},
                {returnOriginal: false}
            );
        })
        .then(res => res.value.places
            .find(place => place.title === placeTitle)
            .checkins.length);
};

const getTitle = url => {
    return quests.findOne({url})
        .then(quest => {
            if (!quest) {
                throw new Error('quest does not exist');
            }

            return quest.title;
        });
};

module.exports = db => {
    quests = db.collection('quests');

    return {
        createQuest,
        getAllQuests,
        removeAllQuests,
        removeQuest,
        getLimitQuests,
        getLimitQuestsSorted,
        getQuest,
        getQuestsById,
        addCommentToQuest,
        likeQuest,
        isPlaceExist,
        addCheckinToPlace,
        addCommentToPlace,
        getTitle
    };
};
