'use strict';

require('./comments.css');

/*  eslint quote-props: [1, "as-needed"] */
$('.commentForm').each(function () {
    $(this).submit(function (event) {
        event.preventDefault();
        var form = $(this);
        var text = form.find('.new-comment').val();
        var url = form.attr('action');
        var name = form.data('name');
        var commentSection = form.prev('section');

        $.ajax({
            method: 'POST',
            url: url,
            data: {
                name: name, text: text
            }
        })
        .done(function (msg) {
            var comment = $('<div></div>', {
                class: 'panel panel-default'
            });
            var heading = $('<div></div>', {
                class: 'panel-heading'
            });
            var body = $('<div></div>', {
                class: 'panel-body',
                text: msg.text
            });
            heading.appendTo(comment);
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

            form.find('textarea').val('');
            form.find('[type="submit"]').prop('disabled', true);
        })
        .fail(function (msg) {
            console.log(msg);
        });
    });
});

$('.new-comment').each(function () {
    $(this).bind('input propertychange', function () {
        var form = $(this).parent();
        if ($(this).val().length === 0) {
            form.find('[type="submit"]').prop('disabled', true);
        } else {
            form.find('[type="submit"]').prop('disabled', false);
        }
    });
});
