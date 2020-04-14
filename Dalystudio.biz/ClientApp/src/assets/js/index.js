var jQueryBridget = require('jquery-bridget');
var Isotope = require('isotope-layout');
// make Isotope a jQuery plugin
jQueryBridget('isotope', Isotope, $);

import 'lazysizes';

var jconfirm = require('jquery-confirm');

import './custom.js';

jconfirm.defaults = {
    theme: 'my-theme',
    useBootstrap: false
}
