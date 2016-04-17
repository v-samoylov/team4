require('./registration.css');
require('../../blocks/header/header.js');

/* global $: true*/
$('#submit').click(function (e) {
    e.preventDefault();
    var name = $('#name').val();
    var password = $('#password').val();
    var email = $('#email').val();
    $.ajax({
        method: 'POST',
        url: '/user/reg',
        data: {name: name, password: password, email: email}
    })
        .done(function () {
            window.location = '/';
        })
        .fail(function (msg) {
            console.log(msg);
        });
});
