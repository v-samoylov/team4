require('../../blocks/header/header.css');
require('../../blocks/button/button.css');
require('../../blocks/form/form.css');
require('../../blocks/grid/grid.css');
require('../../blocks/footer/footer.css');
require('./authorization.css');
//--
$('#submit').click(function (e) {
    e.preventDefault();
    var password = $('#password').val();
    var email = $('#email').val();
    $.ajax({
        method: "POST",
        url: "/user/login",
        data: { password: password, email: email }
    })
        .done(function (msg) {
            console.log(msg);
        })
        .fail(function (msg) {
            console.log(msg);
        })
});
