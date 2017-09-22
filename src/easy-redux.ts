import { combineReducers } from 'redux';
const cache = {};

/**
 * Add reducer to application reducers cache,  for further combine it with redux final reducers
 * Use this function when you want to combine your components reducers to final reducers
 * @param {String} key - reducers key
 * @param {Function} fn - reducer
 * @param {Boolean} replace - replace existing reducer in cache
 *
 */
export function applyReducer (key, fn, replace = false) {
    if (!!cache[key] && !replace) {
        return console.error(`Reducer with name ${key} exists`);
    }
    cache[key] = fn;
}

export function mergeReducer(key, fn) {
    if (!cache[key]) {
        throw new Error(`Reducer with name ${key} not found`);
    }
    applyReducer(key, localCompose(cache[key], fn), true);
}



/**
 *
 * @param {Object} reducers - reducers that must be merged with cached
 */
export function combine (reducers = {}) {
    return combineReducers({...reducers, ...cache});
}

/**
 * combine reducers to pass them to the store under single key
 * @param {Array} reducers
 * @returns {Function}
 */
export function localCompose (...reducers) {
    return function (state, action) {
        return reducers.reduce((prevState, currentReducer) => {
            return currentReducer(prevState, action)
        }, state);
    }
}