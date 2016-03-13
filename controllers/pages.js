exports.index = (req, res) => {
    res.send('Hello, team4! it\'s index page')
};

exports.error404 = (req, res) => {
    res.sendStatus(404);
};