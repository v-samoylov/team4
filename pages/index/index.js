'use strict';

require('./index.css');

$(function () {
    var skip = 3;
    var end = false;
    var $loadGif = $('.more-loading-gif');

    function scroll() {
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                if (!end) {
                    $(window).unbind('scroll');
                    $loadGif.fadeIn('medium');
                    setTimeout(getMore, 500);
                }
            }
        });
    }
    
    function getMore() {
        $.ajax({
            method: "POST",
            url: "/get-more-quests",
            data: {
                skip: skip,
                get: 3
            }
        })
        .done(function (data) {
            if (!end && data.quests.length == 0) { // eslint-disable-line
                end = true;
                $loadGif.fadeOut('medium');

                return;
            }

            skip += data.quests.length;

            data.quests.forEach(function (quest) {
                var $newElem = $('<div></div>', {
                    class: 'text-center'
                });

                var $imgBox = $('<div></div>', {
                    class: 'img-box'
                }).appendTo($newElem);

                $('<img>', {
                    class: 'img-responsive img-border img-full',
                    src: quest.photo,
                    alt: quest.title
                }).appendTo($imgBox);

                $('<h2></h2>', {
                    text: quest.title
                }).appendTo($newElem);

                $('<a></a>', {
                    href: '/quest/' + quest.url,
                    class: 'btn btn-default btn-lg',
                    text: 'Посмотреть'
                }).appendTo($newElem);

                $newElem.append('<hr>');

                $newElem.hide();

                $('#list-of-quests').append($newElem);

                $newElem.fadeIn('medium');

                $loadGif.fadeOut('medium');
                scroll();
            })
        })
        .fail(function () {
            scroll();
        });
    }
    scroll();
});
