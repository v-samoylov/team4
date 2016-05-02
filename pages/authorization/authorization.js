'use strict';

require('./authorization.css');

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
        window.location = '/';
    })
    .fail(function (msg) {
        console.log(msg);
    });
});
