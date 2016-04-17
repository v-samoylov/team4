require('./authorization.css');
require('../../blocks/header/header.js');

/* global $: true*/
$('#submit').click(function (e) {
    e.preventDefault();
    var password = $('#password').val();
    var email = $('#email').val();
    $.ajax({
        method: "POST",
        url: "/user/login",
        data: {password: password, email: email}
    })
        .done(function (msg) {
            console.log(msg);
        })
        .fail(function (msg) {
            console.log(msg);
        });
});
