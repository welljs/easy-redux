'use strict';exports.__esModule = true;var _middleware = require('./middleware');Object.defineProperty(exports, 'middleware', { enumerable: true, get: function get() {return _interopRequireDefault(_middleware).

        default;} });var _easyRedux = require('./easy-redux');Object.defineProperty(exports, 'applyReducer', { enumerable: true, get: function get() {return _easyRedux.


        applyReducer;} });Object.defineProperty(exports, 'localCompose', { enumerable: true, get: function get() {return _easyRedux.
        localCompose;} });Object.defineProperty(exports, 'combine', { enumerable: true, get: function get() {return _easyRedux.
        combine;} });Object.defineProperty(exports, 'mergeReducer', { enumerable: true, get: function get() {return _easyRedux.
        mergeReducer;} });var _actionCreator = require('./actionCreator');Object.defineProperty(exports, 'createAction', { enumerable: true, get: function get() {return _actionCreator.


        createAction;} });Object.defineProperty(exports, 'createActions', { enumerable: true, get: function get() {return _actionCreator.
        createActions;} });function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var isFunction = exports.isFunction = function isFunction(thing) {return typeof thing === 'function';};