'use strict';
require('../../blocks/place/place.css');
require('../../blocks/place/place.js');
require('../../blocks/comments/comments.css');
require('../../blocks/comments/comments.js');
require('./quest.css');

$('.panel.main .panel-heading').each(function () {
    $(this).click(function () {
        var last = $(this).next();
        if ($(last).css('display') === 'none') {
            $(last).css('display', 'block');
        } else {
            $(last).css('display', 'none');
        }
    });
});

$('#quest-like').change(function () {
    var name = $('#quest-title').html();
    $.ajax({
        method: 'POST',
        url: '/like-quest/',
        data: {
            name: name
        }
    })
    .done(function (respond) {
        $('#likes-count').html(respond.count);
    })
    .fail(function (msg) {
        console.log(msg);
    });
});
