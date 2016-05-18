'use strict';

require('./base.css');
require('../../blocks/header/header.js');
require('../../blocks/footer/footer.js');

$(function () {
    autosize($('textarea')); // eslint-disable-line
});
