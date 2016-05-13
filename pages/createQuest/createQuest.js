'use strict';

require('./createQuest.css');
require('../../blocks/yandexMap/yandexMap.css');

var validator = require('../../lib/forms/forms');

var addQuestForm = {
    init: function () {
        this._collectData();
        validator.init();
        this._bindEvents();
        this._$places.find('.js-place').find('.mapBox').append(this._$templateMap.clone());
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
<<<<<<< HEAD
        ymaps.ready(function () { // eslint-disable-line
            this._initMap(this._$places.find('.js-place'));
        }.bind(this));
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
        this._initMap(newPlace);
=======
        ymaps.ready( // eslint-disable-line
            function () {
                this._initMap(this._$places.find('.js-place'));
            }.bind(this)
        );
    },

    _addPlace: function () {
        var $newPlace = this._$templatePlace.clone();

        $newPlace.find('.mapBox').append(this._$templateMap.clone());
        $newPlace.hide().appendTo(this._$places).fadeIn('medium');

        validator.init();
        validator.updateInputs();

        this._initMap($newPlace);
>>>>>>> 66ebf90768a4e2c2a869c7ac885be00093175cde
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
    },

    _initMap: function (place) {
        place.map = new ymaps.Map( // eslint-disable-line
            place.find('.ymap')[0],
            {
                center: [56.85, 60.60],
                zoom: 10,
                controls: []
            }
        );
        place.map.placemark = null;
        place.map.events.add(
            'click', function (e) {
                var coords = e.get('coords');
                this._setPlacemark(place, coords);
            }.bind(this)
        );
        place.find('.js-location-search-button').click(
            function () {
                var addressInputField = place.find('.js-address-field');
                this._setPlacemark(place, addressInputField.val(), true);
            }.bind(this)
        );
        place.find('.js-current-location-search-button').click(
            function () {
                var options = {
                    enableHighAccuracy: true,
                    maximumAge: 50000,
                    timeout: 10000
                };
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var coords = [position.coords.latitude, position.coords.longitude];
                        this._setPlacemark(place, coords, true);
                    }.bind(this),
                    function (error) {
                        console.log(error);
                    },
                    options
                );
            }.bind(this)
        );
    },

    _setPlacemark: function (place, location, isCentered) {
        if (place.map.placemark) {
            place.map.geoObjects.remove(place.map.placemark);
            place.map.placemark = null;
        }
        var addressField = place.find('.form-control.address-place');
        var coordinatesField = place.find('.form-control.coordinates-place');

        var cb = function (res) {
            var nearest = res.geoObjects.get(0);
            var coords;
            if (location instanceof Array) {
                coords = location;
            } else {
                coords = nearest.geometry.getCoordinates();
            }
            var address = nearest.properties.get('name');
            place.map.placemark = new ymaps.Placemark(coords); // eslint-disable-line
            if (isCentered) {
                place.map.setCenter(coords, 17);
            }
            place.map.placemark.events.add('dblclick', function (evt) {
                evt.preventDefault();
                place.map.geoObjects.remove(place.map.placemark);
                place.map.placemark = null;
                addressField.val('').change();
                coordinatesField.val('');
            });
            place.map.geoObjects.add(place.map.placemark);
            addressField.val(address).change();
            coordinatesField.val(coords);
        };
        ymaps.geocode(location).then(cb); // eslint-disable-line
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
