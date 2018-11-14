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
var easy_redux_1 = require("./easy-redux");
function createAction(name, options) {
    var WAIT = "WAIT@" + name;
    var SUCCESS = "SUCCESS@" + name;
    var FAIL = "FAIL@" + name;
    var type = name;
    var action = options.action, async = options.async, storeKey = options.storeKey, handlers = options.handlers, handler = options.handler, initialState = options.initialState;
    var reducer;
    if (!initialState) {
        throw new Error('Initial state should not be null or undefined');
    }
    if (!storeKey) {
        throw new Error("Store key at action " + name + " not defined");
    }
    if (async && handlers) {
        checkAsyncHandlers(handlers);
        reducer = function (state, action) {
            if (state === void 0) { state = initialState; }
            switch (action.type) {
                case WAIT:
                    return handlers.onWait(state, action);
                case SUCCESS:
                    return handlers.onSuccess(state, action);
                case FAIL:
                    return handlers.onFail(state, action);
                default:
                    return state;
            }
        };
    }
    else if (async && !handlers) {
        throw new Error("Expected handlers in async action " + name);
    }
    else {
        if (!isFunction(handler)) {
            throw new Error("Expected that synchronous action " + name + " handler will be a function, and it will returns new state");
        }
        reducer = function (state, action) {
            if (state === void 0) { state = initialState; }
            return action.type === name ? handler(state, action) : state;
        };
    }
    easy_redux_1.mergeReducer(storeKey, reducer);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (function () {
            var _a = action.apply(undefined, args), promise = _a.promise, excludeTypeFromActionIfExists = _a.type, actionPayload = __rest(_a, ["promise", "type"]);
            if (async) {
                if (typeof promise !== 'function') {
                    throw new Error("Async action " + name + " should return promise property of Function type");
                }
                else {
                    return __assign({ types: [WAIT, SUCCESS, FAIL], promise: promise }, actionPayload);
                }
            }
            else {
                return __assign({ type: type }, actionPayload);
            }
        })();
    };
}
exports.createAction = createAction;
function createActions(options) {
    var actions = options.actions, globalInitialState = options.initialState, globalStoreKey = options.storeKey;
    if (!Object.keys(actions)) {
        throw new Error('No any action passed');
    }
    return Object.entries(actions).reduce(function (res, _a) {
        var actionName = _a[0], actionOptions = _a[1];
        var optionAsync = actionOptions.async, initialState = actionOptions.initialState, storeKey = actionOptions.storeKey, action = actionOptions.action, handler = actionOptions.handler, handlers = actionOptions.handlers;
        var async = optionAsync || !!handlers;
        res[actionName] = createAction(actionName, {
            async: async,
            action: action,
            handler: handler,
            handlers: handlers,
            initialState: initialState || globalInitialState,
            storeKey: storeKey || globalStoreKey,
        });
        return res;
    }, {});
}
exports.createActions = createActions;
function checkAsyncHandlers(handlers) {
    var onWait = handlers.onWait, onSuccess = handlers.onSuccess, onFail = handlers.onFail;
    var errMessage = function (fnName) { return "Expected that the " + fnName + " will be a function, and will returns new state"; };
    if (!isFunction(onWait)) {
        throw new Error(errMessage('onWait'));
    }
    if (!isFunction(onSuccess)) {
        throw new Error(errMessage('onSuccess'));
    }
    if (!isFunction(onFail)) {
        throw new Error(errMessage('onFail'));
    }
}
var isFunction = function (thing) { return typeof thing === 'function'; };
