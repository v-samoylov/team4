$(function () {
    $('.check-in').each(function () {
        $(this).click(function () {
            var name = $(this).data('name');
            var options = {
                enableHighAccuracy: true,
                maximumAge: 50000,
                timeout: 10000
            };
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
                            console.log('Check-in');
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
        });
    });
});
