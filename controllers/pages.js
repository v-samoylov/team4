const debug = require('debug')('team4:controllers:pages');

exports.index = (req, res) => {
    debug('index');
    res.render('authorization/authorization', {});
};
exports.reg = (req, res) => {
    debug('reg');
    res.render('registration/registration', {});
};

exports.error404 = (req, res) => {
    debug('error404');
    res.status(404).render('notFound/notFound', {});
};
