$('.check-in').each(function () {
    $(this).click(function () {
        var names = $(this).data('name').split('#');
        var questName = names[0];
        var placeName = names[1];
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
                        quest: questName,
                        place: placeName,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
            }
        );
    });
});