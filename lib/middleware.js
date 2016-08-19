'use strict';exports.__esModule = true;var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);var _promise2 = require('babel-runtime/core-js/promise');var _promise3 = _interopRequireDefault(_promise2);var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);exports.default =
function (request) {
    return function (_ref) {var dispatch = _ref.dispatch;var getState = _ref.getState;return function (next) {return function (action) {
                if (typeof action === 'function') {
                    return action(dispatch, getState);
                }var
                promise = action.promise;var types = action.types;var rest = (0, _objectWithoutProperties3.default)(action, ['promise', 'types']);
                if (!promise) {
                    return next(action);
                }var

                REQUEST = types[0];var SUCCESS = types[1];var FAILURE = types[2];
                var actionPromise = promise(request);

                if (!(actionPromise instanceof _promise3.default)) {var _actionPromise =
                    actionPromise;var _promise = _actionPromise.promise;var actionRest = (0, _objectWithoutProperties3.default)(_actionPromise, ['promise']);
                    if (typeof _promise !== 'function') {
                        throw new Error('Bad promise');
                    }
                    rest = (0, _assign2.default)(rest, actionRest);
                    actionPromise = _promise(request);
                }

                next((0, _extends3.default)({}, rest, { type: REQUEST }));
                actionPromise.
                then(function (result) {return next((0, _extends3.default)({}, rest, { result: result, type: SUCCESS }));}).
                catch(function (error) {return next((0, _extends3.default)({}, rest, { error: error, type: FAILURE }));});
                return actionPromise;
            };};};
};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}module.exports = exports['default'];