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
    var title = $('#quest-title').html();
    var valueInput = $('#likes-count');
    var oldValue = Number($(valueInput).html());
    var newValue = $(this).prop('checked') ? oldValue + 1 : Math.max(0, oldValue - 1);
    $(valueInput).html(newValue);
    var checkbox = $(this);
    $(checkbox).prop('disabled', true);
    $.ajax({
        method: 'POST',
        url: '/like-quest/',
        data: {title}
    })
    .done(function (respond) {
        $(checkbox).prop('disabled', false);
        $(valueInput).html(respond.count);
    })
    .fail(function (msg) {
        $(valueInput).html(oldValue);
        $(this).prop('checked', !$(this).prop('checked'));
        console.log(msg);
    });
});

$('#start-quest').click(function () {
    var title = $('#quest-title').html();
    $.ajax({
        method: 'POST',
        url: '/start-quest/',
        data: {title}
    })
        .done(function (respond) {
            window.location = '/quest/' + respond.url;
        })
        .fail(function (msg) {
            console.log(msg);
        });
});
