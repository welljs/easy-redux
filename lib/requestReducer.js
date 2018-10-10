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
import { applyReducer, localCompose } from './easy-redux';
var appStore = null;
var cache = {};
function createReducer(_a) {
    var storeKey = _a.storeKey, reducerName = _a.reducerName, initialState = _a.initialState, handlers = _a.handlers;
    var WAITING_STATE = storeKey + "@" + reducerName + ".waiting";
    var SUCCESS_STATE = storeKey + "@" + reducerName + ".success";
    var FAIL_STATE = storeKey + "@" + reducerName + ".fail";
    var onWaiting = handlers.onWaiting, onFail = handlers.onFail, onSuccess = handlers.onSuccess;
    return {
        reducer: function (state, action) {
            if (state === void 0) { state = Object.assign({ isFailed: false, isWaiting: false }, initialState); }
            switch (action.type) {
                case WAITING_STATE: {
                    if (typeof onWaiting === 'function') {
                        return Object.assign({}, onWaiting(state, action), { isWaiting: true, isFailed: false });
                    }
                    else {
                        return Object.assign({}, state, { isWaiting: true, isFailed: false });
                    }
                }
                case SUCCESS_STATE: {
                    if (typeof onSuccess === 'function') {
                        return Object.assign({ isWaiting: false, isFailed: false }, onSuccess(state, action));
                    }
                    else {
                        return Object.assign({}, state, { isWaiting: false, isFailed: false, data: action.result });
                    }
                }
                case FAIL_STATE: {
                    if (typeof onFail === 'function') {
                        return Object.assign({ isWaiting: false, isFailed: true }, onFail(state, action));
                    }
                    else {
                        return Object.assign({}, state, { isWaiting: false, isFailed: true, error: action.error });
                    }
                }
                default: return state;
            }
        },
        submit: function () {
            var promise = handlers.promise;
            var args = arguments;
            return {
                types: [WAITING_STATE, SUCCESS_STATE, FAIL_STATE],
                promise: function (request) { return promise(request).apply(void 0, args); }
            };
        }
    };
}
export function applyRequestReducers(storeKey, data, replace) {
    if (replace === void 0) { replace = false; }
    var reducers = [];
    var commonInitialState = {
        error: null
    };
    Object.entries(data).forEach(function (_a) {
        var reducerName = _a[0], options = _a[1];
        var initialState = options.initialState, handlers = __rest(options, ["initialState"]);
        initialState = Object.assign(initialState, commonInitialState);
        var cacheKey = storeKey + "." + reducerName;
        cache[cacheKey] = __assign({}, createReducer({ storeKey: storeKey, reducerName: reducerName, initialState: initialState, handlers: handlers }));
        reducers.push(cache[cacheKey].reducer);
    });
    return applyReducer(storeKey, localCompose.apply(void 0, reducers), replace);
}
export function createRequestReducer(store) {
    appStore = store;
}
export function requestReducer(key) {
    return {
        submit: function () {
            var _a;
            if (!cache[key]) {
                throw new Error("There is no request reducer with key " + key + " found");
            }
            return appStore ? appStore.dispatch((_a = cache[key]).submit.apply(_a, arguments)) : undefined;
        }
    };
}
//# sourceMappingURL=requestReducer.js.map