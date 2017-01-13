'use strict';exports.__esModule = true;var _entries = require('babel-runtime/core-js/object/entries');var _entries2 = _interopRequireDefault(_entries);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);exports.























createAction = createAction;exports.























































createActions = createActions;var _index = require('./index');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function checkAsyncHandlers(handlers) {var onWait = handlers.onWait,onSuccess = handlers.onSuccess,onFail = handlers.onFail;var errMessage = function errMessage(fnName) {return 'Expected that the ' + fnName + ' will be a function, and will returns new state';};if (!(0, _index.isFunction)(onWait)) {throw new Error(errMessage('onWait'));}if (!(0, _index.isFunction)(onSuccess)) {throw new Error(errMessage('onSuccess'));}if (!(0, _index.isFunction)(onFail)) {throw new Error(errMessage('onFail'));}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {String} name
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {Object} options
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @returns {Function}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */function createAction(name) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var WAIT = 'WAIT@' + name;var SUCCESS = 'SUCCESS@' + name;var FAIL = 'FAIL@' + name;var type = name;var action = options.action,async = options.async,storeKey = options.storeKey,handlers = options.handlers,handler = options.handler,initialState = options.initialState;var reducer = void 0;if (!initialState) {throw new Error('Initial state should not be null or undefined');}if (!storeKey) {throw new Error('Store key at action ' + name + ' not defined');}if (async) {checkAsyncHandlers(handlers);reducer = function reducer() {var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;var action = arguments[1];switch (action.type) {case WAIT:return handlers.onWait(state, action);case SUCCESS:return handlers.onSuccess(state, action);case FAIL:return handlers.onFail(state, action);default:return state;}};} else {if (!(0, _index.isFunction)(handler)) {throw new Error('Expected that synchronous action ' + name + ' handler will be a function, and it will returns new state');}reducer = function reducer() {var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;var action = arguments[1];return action.type === name ? handler(state, action) : state;};}(0, _index.mergeReducer)(storeKey, reducer);return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return function () {var _action$apply = action.apply(undefined, args),promise = _action$apply.promise,excludeTypeFromActionIfExists = _action$apply.type,actionPayload = (0, _objectWithoutProperties3.default)(_action$apply, ['promise', 'type']);if (async) {if (!(0, _index.isFunction)(promise)) {throw new Error('Async action ' + name + ' should return promise property of Function type');} else {return (0, _extends3.default)({ types: [WAIT, SUCCESS, FAIL], promise: promise }, actionPayload);}} else {return (0, _extends3.default)({ type: type }, actionPayload);}}();};}function defaultAction() {return {};}function createActions() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _assign2.default)({}, defaults);var actions = options.actions,globalInitialState = options.initialState,globalStoreKey = options.storeKey;if (!(0, _keys2.default)(actions)) {throw new Error('No any action passed');}return (0, _entries2.default)(actions).reduce(function (res, _ref) {var actionName = _ref[0],actionOptions = _ref[1];var

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