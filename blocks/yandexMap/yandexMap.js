'use strict';

module.exports.createMap = function () {
    var myMap;
    var placemark = null;
    var setPlacemark = function (location, isCentered) {
        if (placemark) {
            myMap.geoObjects.remove(placemark);
        }
        var addressField = document.querySelector('.form-control.address-place');
        var coordinatesField = document.querySelector('.form-control.coordinates-place');
        var addressValiditySing = document.querySelector('.input-group-addon.address-place');
        var cb = function (res) {
            var nearest = res.geoObjects.get(0);
            var coords;
            if (location instanceof Array) {
                coords = location;
            } else {
                coords = nearest.geometry.getCoordinates();
            }
            var address = nearest.properties.get('name');
            placemark = new ymaps.Placemark(coords); // eslint-disable-line
            if (isCentered) {
                myMap.setCenter(coords, 17);
            }
            placemark.events.add('dblclick', function (evt) {
                evt.preventDefault();
                myMap.geoObjects.remove(placemark);
                placemark = null;
                addressField.value = "";
                coordinatesField.value = "";
                addressValiditySing.classList.remove('success');
                addressValiditySing.classList.add('danger');
                addressValiditySing.children[0].classList.remove('glyphicon-ok');
                addressValiditySing.children[0].classList.add('glyphicon-remove');
            });
            myMap.geoObjects.add(placemark);
            addressField.value = address;
            coordinatesField.value = coords;
            addressValiditySing.classList.remove('danger');
            addressValiditySing.classList.add('success');
            addressValiditySing.children[0].classList.remove('glyphicon-remove');
            addressValiditySing.children[0].classList.add('glyphicon-ok');
        };
        ymaps.geocode(location).then(cb); // eslint-disable-line
    };
    ymaps.ready(init); // eslint-disable-line
    function init() {
        myMap = new ymaps.Map("map", { // eslint-disable-line
            center: [56.85, 60.60],
            zoom: 10,
            controls: []
        });
        myMap.events.add('click', function (evt) {
            var coords = evt.get('coords');
            setPlacemark(coords);
        });
    }
    
    var submitHandler = function () {
        var addressInputField = document.querySelector('.address-field');
        setPlacemark(addressInputField.value, true);
    };
    var currLocationHandler = function () {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 50000,
            timeout: 10000
        };
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var coords = [position.coords.latitude, position.coords.longitude];
                setPlacemark(coords, true);
            },
            function (error) {
                console.log(error);
            },
            options
        );
    };
    
    document.querySelector('.location-search-button').onclick = submitHandler;
    document.querySelector('.current-location-search-button').onclick = currLocationHandler;
    
    Handlebars.registerPartial('userMessage',
        '<{{tagName}}>By {{author.firstName}} {{author.lastName}}</{{tagName}}>'
        + '<div class="body">{{body}}</div>');
    
    var context = {
      author: {firstName: "Alan", lastName: "Johnson"},
      body: "I Love Handlebars",
      comments: [{
        author: {firstName: "Yehuda", lastName: "Katz"},
        body: "Me too!"
      }]
    };

};

