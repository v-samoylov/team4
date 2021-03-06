'use strict';

require('../../blocks/authAndReg/authAndReg.css');

var validator = require('../../lib/forms/forms.js');
var getCookie = require('../../lib/getCookie.js');

$(function () {
    validator.init();

    var errorInfo = $('.bg-danger.danger-message');

    $('#reg-form').submit(function (e) {
        e.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();

        $.ajax({
            method: 'POST',
            url: '/user/reg',
            data: {
                name: name, password: password, email: email
            }
        })
        .done(function (msg) {
            console.log(msg);
            var referrer = getCookie('referrer');

            if (referrer) {
                window.location = referrer;
            } else {
                window.location = '/';
            }
        })
        .fail(function (msg) {
            console.log(msg);
            errorInfo.empty().append(msg.responseText).show();
        });
    });
});
