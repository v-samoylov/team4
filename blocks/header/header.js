'use strict';

require('./header.css');
require('./horsey.css');

var $searchField = $('.search-field');

/* eslint no-undef: "off" */
horsey($searchField[0], {
    suggestions: function (value, done) {
        var items = ['test quest'];
        $.ajax({
            url: '/get-quest-titles',
            type: 'POST',
            data: {get: 100}
        })
            .done(function (res) {
                items = res.quests;
                done(items);
            });
    },
    appendTo: $('.search-line')[0],
    limit: 2
});

$searchField
    .bind('horsey-filter', function () {
        $('.sey-list')
            .addClass('dropdown-menu search-dropdown');
    });

$('.search').submit(function (e) {
    e.preventDefault();
    window.location = '/search?query=' + $searchField.val();
});
