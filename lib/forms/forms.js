'use strict';

module.exports = {
    init: function () {
        this._collectData();
        this._bindEvents();
    },

    _collectData: function () {
        this._$inputs = $('.input-group input[required], .input-group textarea[required]');
    },

    _bindEvents: function () {
        this._$inputs.on('keyup change', this._validate);
    },

    updateInputs: function () {
        this._$inputs.trigger('change');
    },

    _validate: function () {
        var $form = $(this).closest('form');
        var $group = $(this).closest('.input-group');
        var $addon = $group.find('.input-group-addon');
        var $icon = $addon.find('span');

        var state = false;

        switch (!$group.data('validate')) {
            case 'email':
                state = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                    .test($(this).val());
                break;
            case 'length':
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
            $addon.removeClass('danger');
            $addon.addClass('success');
            $icon.attr('class', 'glyphicon glyphicon-ok');
        } else {
            $addon.removeClass('success');
            $addon.addClass('danger');
            $icon.attr('class', 'glyphicon glyphicon-remove');
        }

        if ($form.find('.input-group-addon.danger').length === 0) {
            $form.find('[type="submit"]').prop('disabled', false);
        } else {
            $form.find('[type="submit"]').prop('disabled', true);
        }
    }
};
