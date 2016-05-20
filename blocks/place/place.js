require('./place.css');

function checkIn() {
    var name = $(this).data('name');
    var countId = $(this).data('url') + '-count';
    var options = {
        enableHighAccuracy: true,
        maximumAge: 50000,
        timeout: 10000
    };
    var button = this;

    navigator.geolocation.getCurrentPosition(
        function (position) {
            swal({ //eslint-disable-line
                title: "Вы на месте?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                confirmButtonText: "Да!",
                cancelButtonText: "Отмена"
            }, function () {
                $.ajax({
                    url: '/quest/checkin/',
                    type: 'POST',
                    data: {
                        name: name,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
                .done(function (msg) {
                    var checkIn = $('<span></span>', {
                        class: 'glyphicon glyphicon-ok-circle success-checkIn'
                    });
                    var count = $('#' + countId);
                    count.html(msg.checkinCount);
                    swal("Отлично!", "Вы нашли место!", "success");//eslint-disable-line
                    if (msg.isFinished) {
                        swal("Поздравлем!", "Вы успешно завершили квест!", "success");//eslint-disable-line
                    }
                    var container = $(button).parent().prev();
                    $(container).append(checkIn);
                    $(button).remove();
                })
                .fail(function (err) {
                    swal(err.responseText); //eslint-disable-line
                });
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
