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
var routeMap;
$(function () {
    $('.check-in').each(function () {
        $(this).click(checkIn);
    });

    $('.insta-img').click(function () {
        var placeLatitude = parseFloat($(this).data('latitude'));
        var placeLongitude = parseFloat($(this).data('longitude'));
        console.log(placeLatitude, placeLongitude);
    });

    $('.add-route-btn').click(function () {
        ymaps.ready(setRoute(this)); //eslint-disable-line
    });

    var setRoute = function (obj) {
        var placeLatitude = parseFloat($(obj).data('latitude'));
        var placeLongitude = parseFloat($(obj).data('longitude'));

        var map = $(obj).data('target').split('#')[1];
        console.log(placeLatitude, placeLongitude, map);
        var options = {
            enableHighAccuracy: true,
            maximumAge: 50000,
            timeout: 10000
        };
        navigator.geolocation.getCurrentPosition(
            function (position) {
                if (!routeMap) {
                    routeMap = new ymaps.Map(map, { //eslint-disable-line
                        center: [placeLatitude, placeLongitude],
                        zoom: 10,
                        controls: []
                    });
                }
                var userCoords = [position.coords.latitude, position.coords.longitude];
                // тестовая точка
                ymaps.route([ //eslint-disable-line
                    {type: 'wayPoint', point: userCoords},
                    {type: 'wayPoint', point: [placeLatitude, placeLongitude]}
                ], {
                    mapStateAutoApply: true
                }).then(function (route) {
                    route.getPaths().options.set({
                        strokeColor: '0000ffff',
                        opacity: 0.9
                    });
                    routeMap.geoObjects.add(route);
                });
            },
            function (error) {
                console.log(error);
            },
            options
        );
    };
});
