exports.index = (req, res) => {
    res.render('authorization/authorization', {});
};

exports.error404 = (req, res) => {
    res.sendStatus(404);
};