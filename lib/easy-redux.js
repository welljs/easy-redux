'use strict';exports.__esModule = true;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};exports.











applyReducer = applyReducer;exports.






mergeReducer = mergeReducer;exports.













combine = combine;exports.








localCompose = localCompose;var _redux = require('redux');var _index = require('./index');var cache = {}; /**
                                                                                                           * Add reducer to application reducers cache,  for further combine it with redux final reducers
                                                                                                           * Use this function when you want to combine your components reducers to final reducers
                                                                                                           * @param {String} key - reducers key
                                                                                                           * @param {Function} fn - reducer
                                                                                                           * @param {Boolean} replace - replace existing reducer in cache
                                                                                                           *
                                                                                                           */function applyReducer(key, fn) {var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;if (!!cache[key] && !replace) {return console.error('Reducer with name ' + key + ' exists');}cache[key] = fn;}function mergeReducer(key, fn) {if (!cache[key]) {//blank reducer if not exist
        cache[key] = function (state) {return state;};}applyReducer(key, localCompose(cache[key], fn), true);} /**
                                                                                                                *
                                                                                                                * @param {Object} reducers - reducers that must be merged with cached
                                                                                                                */function combine() {var reducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return (0, _redux.combineReducers)(_extends({}, reducers, cache));} /**
                                                                                                                                                                                                                                                                                                 * combine reducers to pass them to the store under single key
                                                                                                                                                                                                                                                                                                 * @param {Array} reducers
                                                                                                                                                                                                                                                                                                 * @returns {Function}
                                                                                                                                                                                                                                                                                                 */function localCompose() {for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {reducers[_key] = arguments[_key];}return function (state, action) {return reducers.reduce(function (prevState, currentReducer) {return currentReducer(prevState, action);}, state);};}