'use strict';

module.exports = {
    init: function () {
        this._collectData();
        this._bindEvents();
        this.updateInputs();
    },

    _collectData: function () {
        this._$inputs = $('.js-input-group input[required], .js-input-group textarea[required]');
    },

    _bindEvents: function () {
        this._$inputs.on('keyup change', this._validate);
    },

    updateInputs: function () {
        this._$inputs.trigger('change');
    },

    _validate: function () {
        var $form = $(this).closest('form');
        var $formGroup = $(this).closest('.form-group');
        var $group = $(this).closest('.js-input-group');
        var $icon = $group.find('.form-control-feedback');

        var state = false;

        switch ($group.data('validate')) {
            case 'email':
                state = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                    .test($(this).val());
                break;
            case 'max-length':
                state = $(this).val().length <= $group.data('length');
                break;
            case 'min-length':
                state = $(this).val().length >= $group.data('length');
                break;
            case 'number':
                state = !isNaN(parseFloat($(this).val())) && isFinite($(this).val());
                break;
            default:
                /* eslint no-unneeded-ternary: 0 */
                state = $(this).val() ? true : false;
        }

        if (state) {
            $formGroup.removeClass('has-error');
            $formGroup.addClass('has-success');
            $icon.removeClass('glyphicon-remove');
            $icon.addClass('glyphicon-ok');
        } else {
            $formGroup.removeClass('has-success');
            $formGroup.addClass('has-error');
            $icon.removeClass('glyphicon-ok');
            $icon.addClass('glyphicon-remove');
        }
        if ($form.find('.form-group.has-feedback.has-error').length === 0) {
            $form.find('[type="submit"]').prop('disabled', false);
        } else {
            $form.find('[type="submit"]').prop('disabled', true);
        }
    }
};
