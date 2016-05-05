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
        window.location = '/';
    })
    .fail(function (msg) {
        console.log(msg);
    });
});
