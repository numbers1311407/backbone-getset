(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'Backbone', 'underscore'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(exports, require('backbone'), require('underscore'));
  } else {
    // Browser globals
    factory({}, root.Backbone, root._);
  }
}(this, function (exports, Backbone, _) {
  // @include ./backbone-getset.js
}));
