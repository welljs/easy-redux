'use strict';exports.__esModule = true;var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);exports.























createAction = createAction;var _index = require('./index');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function checkAsyncHandlers(handlers) {var onWait = handlers.onWait;var onSuccess = handlers.onSuccess;var onFail = handlers.onFail;var errMessage = function errMessage(fnName) {return 'Expected that the ' + fnName + ' will be a function, and will returns new state';};if (!(0, _index.isFunction)(onWait)) {throw new Error(errMessage('onWait'));}if (!(0, _index.isFunction)(onSuccess)) {throw new Error(errMessage('onSuccess'));}if (!(0, _index.isFunction)(onFail)) {throw new Error(errMessage('onFail'));}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param {String} name
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param {Object} options
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @returns {Function}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */function createAction(name) {var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];var WAIT = 'WAIT@' + name;var SUCCESS = 'SUCCESS@' + name;var FAIL = 'FAIL@' + name;var type = name;var action = options.action;var async = options.async;var storeKey = options.storeKey;var handlers = options.handlers;var handler = options.handler;var initialState = options.initialState;
    var reducer = void 0;

    if (!initialState) {
        throw new Error('Initial state should not be null or undefined');
    }

    if (!storeKey) {
        throw new Error('Store key at action ' + name + ' not defined');
    }

    if (async) {
        checkAsyncHandlers(handlers);
        reducer = function reducer() {var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];var action = arguments[1];
            switch (action.type) {
                case WAIT:return handlers.onWait(state, action);
                case SUCCESS:return handlers.onSuccess(state, action);
                case FAIL:return handlers.onFail(state, action);
                default:return state;}

        };
    } else
    {
        if (!(0, _index.isFunction)(handler)) {
            throw new Error('Expected that actions ' + name + ' handler will be a function, and it will returns new state');
        }
        reducer = function reducer() {var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];var action = arguments[1];return action.type === name ? handler(state, action) : state;};
    }

    (0, _index.mergeReducer)(storeKey, reducer);

    return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
        return function () {var _action$apply =
            action.apply(undefined, args);var promise = _action$apply.promise;var excludeTypeFromActionIfExists = _action$apply.type;var actionPayload = (0, _objectWithoutProperties3.default)(_action$apply, ['promise', 'type']);
            if (async) {
                if (!(0, _index.isFunction)(promise)) {
                    throw new Error('Async action ' + name + ' should return promise property of Function type');
                } else
                {
                    return (0, _extends3.default)({ types: [WAIT, SUCCESS, FAIL], promise: promise }, actionPayload);
                }
            } else
            {
                return (0, _extends3.default)({ type: type }, actionPayload);
            }
        }();
    };
}