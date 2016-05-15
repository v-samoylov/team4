'use strict';

require('./index.css');
var skip = 3;

/* global $: true*/
$('#getMore').click(function (e) {
    e.preventDefault();
    $.ajax({
        method: "POST",
        url: "/get-more-quests",
        data: {
            skip: skip,
            get: 3
        }
    })
    .done(function (data) {
        console.log(data);
        skip += data.quests.length;
        data.quests.forEach(function (quest) {
            var newElem = $('<div></div>', {
                class: 'col-lg-12 text-center'
            });
            $('<img>', {
                class: 'img-responsive img-border img-full',
                src: quest.photo,
                alt: quest.title
            }).appendTo(newElem);
            $('<h2></h2>', {
                text: quest.title
            }).appendTo(newElem);
            $('<a></a>', {
                href: '/quest/' + quest.url,
                class: 'btn btn-default btn-lg',
                text: 'Посмотреть'
            }).appendTo(newElem);
            newElem.append('<hr>');
            $('#list-of-quests').append(newElem);
        });
    });
});
