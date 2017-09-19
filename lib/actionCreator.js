'use strict';exports.__esModule = true;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};exports.























createAction = createAction;exports.























































createActions = createActions;var _index = require('./index');function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}function checkAsyncHandlers(handlers) {var onWait = handlers.onWait,onSuccess = handlers.onSuccess,onFail = handlers.onFail;var errMessage = function errMessage(fnName) {return 'Expected that the ' + fnName + ' will be a function, and will returns new state';};if (!(0, _index.isFunction)(onWait)) {throw new Error(errMessage('onWait'));}if (!(0, _index.isFunction)(onSuccess)) {throw new Error(errMessage('onSuccess'));}if (!(0, _index.isFunction)(onFail)) {throw new Error(errMessage('onFail'));}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {String} name
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {Object} options
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @returns {Function}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */function createAction(name) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var WAIT = 'WAIT@' + name;var SUCCESS = 'SUCCESS@' + name;var FAIL = 'FAIL@' + name;var type = name;var action = options.action,async = options.async,storeKey = options.storeKey,handlers = options.handlers,handler = options.handler,initialState = options.initialState;var reducer = void 0;if (!initialState) {throw new Error('Initial state should not be null or undefined');}if (!storeKey) {throw new Error('Store key at action ' + name + ' not defined');}if (async) {checkAsyncHandlers(handlers);reducer = function reducer() {var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;var action = arguments[1];switch (action.type) {case WAIT:return handlers.onWait(state, action);case SUCCESS:return handlers.onSuccess(state, action);case FAIL:return handlers.onFail(state, action);default:return state;}};} else {if (!(0, _index.isFunction)(handler)) {throw new Error('Expected that synchronous action ' + name + ' handler will be a function, and it will returns new state');}reducer = function reducer() {var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;var action = arguments[1];return action.type === name ? handler(state, action) : state;};}(0, _index.mergeReducer)(storeKey, reducer);return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return function () {var _action$apply = action.apply(undefined, args),promise = _action$apply.promise,excludeTypeFromActionIfExists = _action$apply.type,actionPayload = _objectWithoutProperties(_action$apply, ['promise', 'type']);if (async) {if (!(0, _index.isFunction)(promise)) {throw new Error('Async action ' + name + ' should return promise property of Function type');} else {return _extends({ types: [WAIT, SUCCESS, FAIL], promise: promise }, actionPayload);}} else {return _extends({ type: type }, actionPayload);}}();};}function defaultAction() {return {};}function createActions() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.assign({}, defaults);var actions = options.actions,globalInitialState = options.initialState,globalStoreKey = options.storeKey;if (!Object.keys(actions)) {throw new Error('No any action passed');}return Object.entries(actions).reduce(function (res, _ref) {var actionName = _ref[0],actionOptions = _ref[1];var

        optionAsync =





        actionOptions.async,initialState = actionOptions.initialState,storeKey = actionOptions.storeKey,action = actionOptions.action,handler = actionOptions.handler,handlers = actionOptions.handlers;
        var async = optionAsync || !!handlers;
        res[actionName] = createAction(actionName, {
            async: async,
            action: action || defaultAction,
            handler: handler,
            handlers: handlers,
            initialState: initialState || globalInitialState,
            storeKey: storeKey || globalStoreKey });

        return res;
    }, {});
}