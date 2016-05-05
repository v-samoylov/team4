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
        var prevLocation = document.createElement('a');
        prevLocation.href = document.referrer;
        if (
            window.location.hostname !== prevLocation.hostname ||
            !document.referrer ||
            new Set(['/auth', '/reg']).has(prevLocation.pathname)
        ) {
            window.location = '/';
        } else {
            window.location = prevLocation.pathname;
        }
    })
    .fail(function (msg) {
        console.log(msg);
    });
});
