exports.index = (req, res) => {
    res.render('authorization/authorization', {});
};
exports.reg = (req, res) => {
    res.render('registration/registration', {});
};

exports.error404 = (req, res) => {
    res.render('notFound/notFound', {});
};
