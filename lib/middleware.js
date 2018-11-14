"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function middleware(requestHelper) {
    return function (store) {
        return function (next) {
            return function (action) {
                var dispatch = store.dispatch, getState = store.getState;
                if (typeof action === 'function') {
                    return action(dispatch, getState);
                }
                var promise = action.promise, types = action.types, rest = __rest(action, ["promise", "types"]);
                if (!promise) {
                    return next(action);
                }
                var _a = types, REQUEST = _a[0], SUCCESS = _a[1], FAILURE = _a[2];
                var actionPromise;
                if (typeof promise === 'function') {
                    actionPromise = promise(requestHelper);
                }
                if (!(actionPromise instanceof Promise)) {
                    var promise_1 = actionPromise.promise, actionRest = __rest(actionPromise, ["promise"]);
                    if (typeof promise_1 !== 'function') {
                        throw new Error('Bad promise');
                    }
                    rest = Object.assign(rest, actionRest);
                    actionPromise = promise_1(requestHelper);
                }
                next(__assign({}, rest, { type: REQUEST }));
                actionPromise
                    .then(function (result) { return next(__assign({}, rest, { result: result, type: SUCCESS })); })
                    .catch(function (error) { return next(__assign({}, rest, { error: error, type: FAILURE })); });
                return actionPromise;
            };
        };
    };
}
exports.middleware = middleware;
