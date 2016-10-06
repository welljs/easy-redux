import {mergeReducer} from './index';


function isFunction (thing) {
    return typeof thing === 'function';
}

function checkAsyncHandlers (handlers) {
    const {onWait, onSuccess, onFail} = handlers;
    const errMessage = (fnName) => `Expected that the ${fnName} will be a function, and will returns new state`;

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
/**
 *
 * @param {String} name
 * @param {Object} options
 * @returns {Function}
 */
export function createAction (name, options = {}) {
    const WAIT = `WAIT@${name}`;
    const SUCCESS = `SUCCESS@${name}`;
    const FAIL = `FAIL@${name}`;
    const type = name;
    const {action, async, storeKey, handlers, handler, defaultState} = options;
    let reducer;

    if (!defaultState) {
        throw new Error('Default state should not be null or undefined');
    }

    if (!storeKey) {
        throw new Error(`Store key at action ${name} not defined`);
    }

    if (async) {
        checkAsyncHandlers(handlers);
        reducer = (state = defaultState, action) => {
            switch(action.type) {
                case WAIT: return handlers.onWait(state, action);
                case SUCCESS: return handlers.onSuccess(state, action);
                case FAIL: return handlers.onFail(state, action);
                default: return state;
            }
        };
    }
    else {
        if (!isFunction(handler)) {
            throw new Error(`Expected that actions ${name} handler will be a function, and it will returns new state`)
        }
        reducer = (state = defaultState, action) => action.type === name ? handler(state, action) : state;
    }

    mergeReducer(storeKey, reducer);

    return function (...args) {
        return (function () {
            const {promise, type: excludeTypeFromActionIfExists, ...actionPayload} = action.apply(undefined, args);
            if (async) {
                if (typeof promise !== 'function') {
                    throw new Error(`Async action ${name} should return promise property of Function type`);
                }
                else {
                    return {types: [WAIT, SUCCESS, FAIL], promise, ...actionPayload}
                }
            }
            else {
                return {type, ...actionPayload};
            }
        })();
    }
}