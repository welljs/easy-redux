'use strict';exports.__esModule = true;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};exports.default =

function (request) {
    return function (_ref) {var dispatch = _ref.dispatch,getState = _ref.getState;return function (next) {return function (action) {
                if ((0, _index.isFunction)(action)) {
                    return action(dispatch, getState);
                }var
                promise = action.promise,types = action.types,rest = _objectWithoutProperties(action, ['promise', 'types']);
                if (!promise) {
                    return next(action);
                }var

                REQUEST = types[0],SUCCESS = types[1],FAILURE = types[2];
                var actionPromise = promise(request);

                if (!(actionPromise instanceof Promise)) {var _actionPromise =
                    actionPromise,_promise = _actionPromise.promise,actionRest = _objectWithoutProperties(_actionPromise, ['promise']);
                    if (!(0, _index.isFunction)(_promise)) {
                        throw new Error('Bad promise');
                    }
                    rest = Object.assign(rest, actionRest);
                    actionPromise = _promise(request);
                }

                next(_extends({}, rest, { type: REQUEST }));
                actionPromise.
                then(function (result) {return next(_extends({}, rest, { result: result, type: SUCCESS }));}).
                catch(function (error) {return next(_extends({}, rest, { error: error, type: FAILURE }));});
                return actionPromise;
            };};};
};var _index = require('./index');function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}module.exports = exports['default'];