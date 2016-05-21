'use strict';

require('../../blocks/authAndReg/authAndReg.css');

var validator = require('../../lib/forms/forms.js');
var getCookie = require('../../lib/getCookie.js');

$(function () {
    validator.init();

    var errorInfo = $('.bg-danger.danger-message');

    $('#auth-form').submit(function (e) {
        e.preventDefault();

        var password = $('#password').val();
        var email = $('#email').val();

        $.ajax({
            method: 'POST',
            url: '/user/login',
            data: {
                password: password, email: email
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
            errorInfo.empty().append(msg.responseText).show();
        });
    });

    $('#vk').attr('href', 'https://oauth.vk.com/authorize?' +
        'client_id=5471140&display=page&redirect_uri=' + window.location.origin +
        '/auth-vk&scope=email&response_type=code&v=5.52');
});
