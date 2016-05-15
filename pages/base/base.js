'use strict';

require('./base.css');
require('../../blocks/header/header.js');
require('../../blocks/footer/footer.js');
// require('../../blocks/header/header.css');
// require('../../blocks/footer/footer.css');

$('#logout').click(function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/user/logout'
    })
    .done(function (msg) {
        console.log(msg);
        window.location = '/';
    })
    .fail(function (msg) {
        console.log(msg);
    });
});
