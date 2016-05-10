'use strict';

require('./createQuest.css');
var validator = require('../../lib/forms/forms');

var setPlacemark = function (place, map, location, isCentered) {
    if (map.placemark) {
        map.geoObjects.remove(map.placemark);
        map.placemark = null;
    }
    var addressField = place.find('.form-control.address-place')[0];
    var coordinatesField = place.find('.form-control.coordinates-place')[0];
    var addressValiditySing = place.find('.input-group-addon.address-place')[0];

    var cb = function (res) {
        var nearest = res.geoObjects.get(0);
        var coords;
        if (location instanceof Array) {
            coords = location;
        } else {
            coords = nearest.geometry.getCoordinates();
        }
        var address = nearest.properties.get('name');
        map.placemark = new ymaps.Placemark(coords); // eslint-disable-line
        if (isCentered) {
            map.setCenter(coords, 17);
        }
        map.placemark.events.add('dblclick', function (evt) {
            evt.preventDefault();
            map.geoObjects.remove(map.placemark);
            map.placemark = null;
            addressField.value = "";
            coordinatesField.value = "";
            addressValiditySing.classList.remove('success');
            addressValiditySing.classList.add('danger');
            addressValiditySing.children[0].classList.remove('glyphicon-ok');
            addressValiditySing.children[0].classList.add('glyphicon-remove');
        });
        map.geoObjects.add(map.placemark);
        addressField.value = address;
        coordinatesField.value = coords;
        addressValiditySing.classList.remove('danger');
        addressValiditySing.classList.add('success');
        addressValiditySing.children[0].classList.remove('glyphicon-remove');
        addressValiditySing.children[0].classList.add('glyphicon-ok');
    };
    ymaps.geocode(location).then(cb); // eslint-disable-line
};


var initMap = function (place) {
    var myMap = new ymaps.Map(place.find('.map')[0], { // eslint-disable-line
        center: [56.85, 60.60],
        zoom: 10,
        controls: []
    });
    myMap.placemark = null;
    myMap.events.add('click', function (evt) {
        var coords = evt.get('coords');
        setPlacemark(place, myMap, coords);
    });
    place.find('.location-search-button')[0].onclick = function () {
        var addressInputField = place.find('.address-field')[0];
        setPlacemark(place, myMap, addressInputField.value, true);
    };
    place.find('.current-location-search-button')[0].onclick = function () {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 50000,
            timeout: 10000
        };
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var coords = [position.coords.latitude, position.coords.longitude];
                setPlacemark(place, myMap, coords, true);
            },
            function (error) {
                console.log(error);
            },
            options
        );
    };
};

var addQuestForm = {
    init: function () {
        this._collectData();
        validator.init();
        this._bindEvents();
        this._$places.find('.js-place').find('.mapBox').append(this._$templateMap.clone());
        ymaps.ready(function () { // eslint-disable-line
            initMap(this._$places.find('.js-place'));
        }.bind(this));
    },

    _collectData: function () {
        this._$form = $('.js-create-quest-form');
        this._$templatePlace = $('.js-place-template').clone().removeClass('hidden');
        this._$places = $('.js-places');
        this._$place = $('.js-place');
        this._$addPlaceBtn = $('.js-add-place');
        this._$removePlaceBtn = $('.js-remove-place');
        this._$fileInputDiv = $('.js-file-input-div');
        this._$customImagePreview = $('.js-custom-image-preview');
        this._$imagePreviewFileName = $('.js-image-preview-filename');
        this._$imagePreviewInputFile = $('.js-image-preview-input input:file');
        this._$imagePreviewClear = $('.js-image-preview-clear');
        this._$templateMap = $('.map-template').children();

        $('.js-place-template').remove();
    },

    _bindEvents: function () {
        this._$addPlaceBtn.on('click', this._addPlace.bind(this));
        this._$form.on('click', this._$removePlaceBtn.selector, this._removePlace.bind(this));
        this._$form.on(
            'change', this._$imagePreviewInputFile.selector, this._showPreview.bind(this)
        );
        this._$form.on('click', this._$imagePreviewClear.selector, this._clearPreview.bind(this));
    },

    _addPlace: function () {
        var newPlace = this._$templatePlace.clone();
        newPlace.find('.mapBox').append(this._$templateMap.clone());

        newPlace
            .hide()
            .appendTo(this._$places)
            .fadeIn('medium');
        validator.init();
        validator.updateInputs();
        initMap(newPlace);
    },

    _removePlace: function (event) {
        $(event.target).closest(this._$place.selector).fadeOut('medium', function () {
            $(this).remove();
            validator.updateInputs();
        });
    },

    _showPreview: function (event) {
        var $input = $(event.target);
        var $parent = $input.closest(this._$fileInputDiv.selector);
        var $previewPlace = $parent.find(this._$customImagePreview.selector);
        var $fileName = $parent.find(this._$imagePreviewFileName.selector);
        var $clearBtn = $parent.find(this._$imagePreviewClear.selector);
        var $img = $('<img/>', {width: '100%'});

        var file = $input.prop('files')[0];
        var reader = new FileReader();

        reader.onload = function () {
            $clearBtn.show();
            $fileName.val(file.name);
            $img.attr('src', this.result);
            $previewPlace.empty().append($img);
            validator.updateInputs();
        };

        reader.readAsDataURL(file);
    },

    _clearPreview: function (event) {
        var $button = $(event.target);
        var $parent = $button.closest(this._$fileInputDiv.selector);
        $parent.find(this._$customImagePreview).empty();
        $parent.find(this._$imagePreviewFileName.selector).val('');
        $parent.find(this._$imagePreviewInputFile.selector).val('');
        $parent.find(this._$imagePreviewClear.selector).hide();
        validator.updateInputs();
    }
};

$(function () {
    addQuestForm.init();

    $('.js-create-quest-form').submit(function (e) {
        e.preventDefault();
        var formData = new FormData($(this)[0]);

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        });
    });
});
