'use strict';

require('./quest.css');
require('../../blocks/comments/comments.js');

var checkInFunc = require('../../blocks/place/place.js').checkIn;

$(function () {
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
            console.error(msg);
            $(valueInput).html(oldValue);
            $(this).prop('checked', !$(this).prop('checked'));
        });
    });

    $('#review').submit(function (event) {
        event.preventDefault();
        var form = $(this);
        var text = form.find('.new-comment').val();
        var name = form.data('name');
        var commentSection = form.prev('section');

        $.ajax({
            method: 'POST',
            url: '/quest-comment',
            data: {
                name: name, text: text
            }
        })
        .done(function (msg) {
            if (msg && msg.redirect) {
                window.location = msg.redirect;
            }

            var comment = $('<div></div>', {
                class: 'review'
            });

            var heading = $('<div></div>', {
                class: 'review-heading'
            });

            var body = $('<div></div>', {
                class: 'review-body',
                text: msg.text
            });

            heading.appendTo(comment);
            $('<hr>').appendTo(comment);
            body.appendTo(comment);

            $('<span></span>', {
                class: 'glyphicon glyphicon-user',
                'aria-hidden': true
            }).appendTo(heading);

            $('<a></a>', {
                href: '/user/' + msg.url,
                class: 'user-link',
                text: ' ' + msg.author
            }).appendTo(heading);

            commentSection.append(comment);
            $('#empty-reviews').remove();
            form.find('textarea').val('');
            form.find('[type="submit"]').prop('disabled', true);
        })
        .fail(function (msg) {
            console.error(msg);
        });
    });

    /*  eslint quote-props: [1, "as-needed"] */
    $('#start-quest').click(function () {
        var title = $('#quest-title').html();
        var button = this;

        $(button).css('display', 'none');

        $.ajax({
            method: 'POST',
            url: '/start-quest/',
            data: {title}
        })
        .done(function (res) {
            if (res && res.redirect) {
                window.location = res.redirect;
            }

            $(button).remove();

            $('.place .caption').each(function () {
                var name = $(this).data('name');
                var checkIn = $('<button></button>', {
                    class: 'btn btn-success check-in',
                    text: 'Check-in',
                    'data-name': name
                });

                checkIn.click(checkInFunc);
                $(this).append(checkIn);
            });
        })
        .fail(function (msg) {
            console.error(msg);
            $(button).css('display', 'inline-block');
        });
    });
});
