require('./place.css');

function checkIn() {
    var name = $(this).data('name');
    var options = {
        enableHighAccuracy: true,
        maximumAge: 50000,
        timeout: 10000
    };
    var button = this;

    navigator.geolocation.getCurrentPosition(
        function (position) {
            $.ajax({
                url: '/quest/checkin/',
                type: 'POST',
                data: {
                    name: name,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            })
            .done(function () {
                console.log('checkIn');
                var checkIn = $('<span></span>', {
                    class: 'glyphicon glyphicon-ok-circle success-checkIn'
                });
                var container = $(button).parent().prev();
                $(container).append(checkIn);
                $(button).remove();
            })
            .fail(function (err) {
                console.log(err);
            });
        },
        function (error) {
            console.log(error);
        },
        options
    );
}

module.exports.checkIn = checkIn;

$(function () {
    $('.check-in').each(function () {
        $(this).click(checkIn);
    });
});
