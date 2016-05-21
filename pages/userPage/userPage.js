'use strict';

require('./userPage.css');

$(function () {
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
    $('#myTabExample a:first').tab('show');
});
