"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var cache = {};
function applyReducer(key, fn, replace) {
    if (replace === void 0) { replace = false; }
    if (!!cache[key] && !replace) {
        return console.error("Reducer with name " + key + " exists");
    }
    cache[key] = fn;
}
exports.applyReducer = applyReducer;
function combine(reducers) {
    return redux_1.combineReducers(Object.assign({}, reducers, cache));
}
exports.combine = combine;
function localCompose() {
    var reducers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        reducers[_i] = arguments[_i];
    }
    return function (state, action) {
        return reducers.reduce(function (prevState, currentReducer) {
            return currentReducer(prevState, action);
        }, state);
    };
}
exports.localCompose = localCompose;
function mergeReducer(key, fn) {
    if (!cache[key]) {
        cache[key] = function (state) { return state; };
    }
    applyReducer(key, localCompose(cache[key], fn), true);
}
exports.mergeReducer = mergeReducer;
