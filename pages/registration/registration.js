require('../../blocks/header/header.css');
require('../../blocks/button/button.css');
require('../../blocks/form/form.css');
require('../../blocks/grid/grid.css');
require('../../blocks/footer/footer.css');
require('./registration.css');

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
