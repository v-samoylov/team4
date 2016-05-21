require('./place.css');
require('./bootstrap-image-gallery.css');

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
                    swal("Отлично!", "Вы нашли место!", "success"); //eslint-disable-line
                    if (msg.isFinished) {
                        swal("Поздравлем!", "Вы успешно завершили квест!", "success"); //eslint-disable-line
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
        var $target = $(this).data('target');
        var $linksPlace = $($target).find('.js-links').empty();
        var $loadGif = $($target).find('.loading-insta-gif');

        var $placeLatitude = parseFloat($(this).data('latitude'));
        var $placeLongitude = parseFloat($(this).data('longitude'));
        console.log($placeLatitude, $placeLongitude);

        $loadGif.show();

        $.ajax({
            url: '/get-location-insta-photos' + '/' + $placeLatitude + '/' + $placeLongitude, // eslint-disable-line
            type: 'GET'
        })
        .done(function (msg) {
            var ans = JSON.parse(msg);

            if (ans.length) {
                ans.forEach(function (item) {
                    var elem = $('<a />',
                        {
                            href: item.photo,
                            title: 'photo'
                        }
                    );

                    elem.attr('data-gallery', '');

                    elem.append($('<img >', {
                        style: 'display: inline-block; margin: 10px;',
                        src: item.thumnail,
                        alt: 'thumb'
                    }));
                    $linksPlace.append(elem);
                });

                $loadGif.hide();
                $linksPlace.fadeIn('medium');
            } else {
                $loadGif.hide();
                $linksPlace.append(
                    $('<p></p>').text('Здесь никто не чекинился :<')
                ).fadeIn('medium');
            }
        })
        .fail(function (err) {
            console.log(err.responseText); //eslint-disable-line
        });
    });

    $('.add-route-btn').click(function () {
        ymaps.ready(setRoute(this)); //eslint-disable-line
    });

    var setRoute = function (obj) {
        var placeLatitude = parseFloat($(obj).data('latitude'));
        var placeLongitude = parseFloat($(obj).data('longitude'));
        console.log(placeLatitude, placeLongitude);

        var map = $(obj).data('target').split('#')[1];
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
