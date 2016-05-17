'use strict';

require('./createQuest.css');
require('./bootstrap-combobox.css');
require('./bootstrap-combobox.js');
require('../../blocks/yandexMap/yandexMap.js');

var validator = require('../../lib/forms/forms');

var addQuestForm = {
    init: function () {
        this._collectData();
        validator.init();
        this._bindEvents();
        this._$places.find('.js-place').find('.js-map-box').append(this._$templateMap.clone());
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
        this._$imagePreviefFileNameIcon = ('.js-fix-glyphicon');
        this._$imagePreviewInputFile = $('.js-image-preview-input input:file');
        this._$imagePreviewClear = $('.js-image-preview-clear');
        this._$templateMap = $('.js-map-template').children();

        $('.js-place-template').remove();
    },

    _bindEvents: function () {
        this._$addPlaceBtn.on('click', this._addPlace.bind(this));
        this._$form.on('click', this._$removePlaceBtn.selector, this._removePlace.bind(this));
        this._$form.on(
            'change', this._$imagePreviewInputFile.selector, this._showPreview.bind(this)
        );
        this._$form.on('click', this._$imagePreviewClear.selector, this._clearPreview.bind(this));
        ymaps.ready( // eslint-disable-line
            function () {
                this._initMap(this._$places.find('.js-place'));
            }.bind(this)
        );
    },

    _addPlace: function () {
        var $newPlace = this._$templatePlace.clone();

        $newPlace.find('.js-map-box').append(this._$templateMap.clone());
        $newPlace.hide().appendTo(this._$places).fadeIn('medium');
        $(window).scrollTo(this._$addPlaceBtn.selector, 500);

        validator.init();
        validator.updateInputs();

        this._initMap($newPlace);
    },

    _removePlace: function (e) {
        $(e.target).closest(this._$place.selector).fadeOut('medium', function () {
            $(this).remove();
            validator.updateInputs();
        });
    },

    _showPreview: function (e) {
        var $input = $(e.target);
        var $parent = $input.closest(this._$fileInputDiv.selector);
        var $previewPlace = $parent.find(this._$customImagePreview.selector);
        var $fileName = $parent.find(this._$imagePreviewFileName.selector);
        var $icon = $parent.find(this._$imagePreviefFileNameIcon);
        var $clearBtn = $parent.find(this._$imagePreviewClear.selector);
        var $img = $('<img/>', {width: '100%'});

        var file = $input.prop('files')[0];
        var reader = new FileReader();

        reader.onload = function () {
            $clearBtn.show();
            $fileName.val(file.name);
            $img.attr('src', this.result);
            $previewPlace.empty().append($img);
            $icon.attr('style', 'right: 80px');
            validator.updateInputs();
        };

        reader.readAsDataURL(file);
    },

    _clearPreview: function (e) {
        var $button = $(e.target);
        var $parent = $button.closest(this._$fileInputDiv.selector);
        var $icon = $parent.find(this._$imagePreviefFileNameIcon);

        $parent.find(this._$customImagePreview.selector).empty();
        $parent.find(this._$imagePreviewFileName.selector).val('');
        $parent.find(this._$imagePreviewInputFile.selector).val('');
        $parent.find(this._$imagePreviewClear.selector).hide();
        $icon.attr('style', 'right: 40px');
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
        place.map.events.add(
            'dblclick', function (e) {
                e.preventDefault();
            }
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

        this._initLocationSearch(place);
    },

    _setPlacemark: function (place, location, isCentered) {
        var coordinatesField = place.find('.combobox-container > input:first-child');
        var addressField = place.find('input.combobox');

        var cb = function (res) {
            var nearest = res.geoObjects.get(0);
            var coords;

            if (location instanceof Array) {
                coords = location;
            } else {
                coords = nearest.geometry.getCoordinates();
            }

            var address = nearest.properties.get('text');

            var placemark = place.map.geoObjects.get(0);

            if (placemark) {
                if (!placemark.options.get('visible')) {
                    placemark.options.set('visible', true);
                }
                placemark.geometry.setCoordinates(coords);
            } else {
                placemark = new ymaps.Placemark(coords); // eslint-disable-line
                placemark.events.add('dblclick', function () {
                    placemark.options.set('visible', false);
                    coordinatesField.val('');
                    addressField.val('');
                });
                place.map.geoObjects.add(placemark);
            }

            if (isCentered) {
                place.map.setCenter(coords, 17);
            }

            coordinatesField.val(coords);
            addressField.val(address);
        };
        ymaps.geocode(location).then(cb); // eslint-disable-line
    },

    _initLocationSearch: function (place) {
        var combobox = place.find('.combobox');

        combobox.combobox({
            matcher: function () {
                return true;
            }
        });

        combobox = combobox.combobox.get();

        var setPlacemark = this._setPlacemark;
        var addressInputField = place.find('input.combobox');
        var coordsInputField = place.find('.combobox-container > input:first-child');

        coordsInputField.attr('name', 'geo-place');
        coordsInputField.addClass('form-control');
        addressInputField.addClass('form-control');

        place.find('input.combobox').keyup(function () {
            var placemark = place.map.geoObjects.get(0);

            if (placemark && !combobox.selected) {
                placemark.options.set('visible', false);
            }

            var userInput = $(this).val();

            ymaps.geocode(userInput).then(function (res) { //eslint-disable-line
                    var it = res.geoObjects.getIterator();

                    place.find('select.combobox').empty();
                    place.find('select.combobox').append('<option></option>');

                    var placeChoise;

                    while ((placeChoise = it.getNext()) !== it.STOP_ITERATION) {
                        var address = placeChoise.properties.get('text');
                        var coords = placeChoise.geometry.getCoordinates().join(',');
                        var newOption = '<option value="' + coords + '">' + address + '</option>';

                        place.find('select.combobox').append(newOption);
                    }

                    combobox.refresh();
                    combobox.lookup();
                    combobox.show();
                },
                function (err) {
                    console.log(err);
                });
        });

        place.find('.combobox-container > input:first-child').change(function () {
            if (combobox.selected) {
                setPlacemark(place, $(this).val().split(','), true);
            }
        });
    }
};

$(function () {
    addQuestForm.init();

    var boxForm = $('.box');
    var boxLoadingGif = $('.box.loading-gif');
    var errorMessage = $('.bg-danger.danger-message');

    $('.js-create-quest-form').submit(function (e) {
        e.preventDefault();

        var formData = new FormData($(this)[0]);

        boxForm.hide();
        boxLoadingGif.show();
        errorMessage.hide();

        $.ajax({
            url: '/create-quest',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        })
        .done(function (res) {
            window.location = res.url;
        })
        .fail(function (res) {
            boxForm.show();
            boxLoadingGif.hide();
            errorMessage.empty().append(res.responseText).show();
            $(window).scrollTo(errorMessage.selector, 500);
        });
    });
});
