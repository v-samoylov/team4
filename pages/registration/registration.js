'use strict';

require('./registration.css');

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
