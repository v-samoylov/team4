'use strict';

require('./createQuest.css');
require('../../blocks/yandexMap/yandexMap.js');

var validator = require('../../lib/forms/forms');

var addQuestForm = {
    init: function () {
        this._collectData();
        validator.init();
        this._bindEvents();
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
        this
            ._$templatePlace
            .clone()
            .hide()
            .appendTo(this._$places)
            .fadeIn('medium');
        validator.init();
        validator.updateInputs();
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
