import { combineReducers } from 'redux';
var cache = {};
export function applyReducer(key, fn, replace) {
    if (replace === void 0) { replace = false; }
    if (!!cache[key] && !replace) {
        return console.error("Reducer with name " + key + " exists");
    }
    cache[key] = fn;
}
export function combine(reducers) {
    return combineReducers(Object.assign({}, reducers, cache));
}
export function localCompose() {
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
export function mergeReducer(key, fn) {
    if (!cache[key]) {
        cache[key] = function (state) { return state; };
    }
    applyReducer(key, localCompose(cache[key], fn), true);
}
//# sourceMappingURL=easy-redux.js.map