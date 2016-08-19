import {applyReducer, localCompose} from './easy-redux';

let appStore = null;
const cache = {};

function createReducer ({storeKey, reducerName, initialState = {}, handlers}) {
  const WAITING_STATE = `${storeKey}@${reducerName}.waiting`;
  const SUCCESS_STATE = `${storeKey}@${reducerName}.success`;
  const FAIL_STATE = `${storeKey}@${reducerName}.fail`;
  const {onWaiting, onFail, onSuccess} = handlers;
  return {
    reducer (state = {isFailed: false, isWaiting: false, ...initialState}, action = {}) {

      switch (action.type) {
        case WAITING_STATE: {
          if (typeof onWaiting === 'function') {
            return  {...onWaiting(state, action), isWaiting: true, isFailed: false};
          }
          else {
            return {...state, isWaiting: true, isFailed: false}
          }
        }
        case SUCCESS_STATE: {
          if (typeof onSuccess === 'function') {
            return {isWaiting: false, isFailed: false, ...onSuccess(state, action)};
          }
          else {
            return {...state, isWaiting: false, isFailed: false, data: action.result}
          }
        }
        case FAIL_STATE: {
          if (typeof onFail === 'function') {
            return {isWaiting: false, isFailed: true, ...onFail(state, action)};
          }
          else {
            return {...state, isWaiting: false, isFailed: true, error: action.error};
          }
        }
        default: return state;
      }
    },
    submit () {
      let {promise} = handlers;
      promise = promise ||   Promise.resolve();
      const args = arguments;
      return {
        types: [ WAITING_STATE, SUCCESS_STATE, FAIL_STATE ],
        promise: request => promise(request)(...args)
      }
    }
  };
}


/**
 * apply
 * @param {String} storeKey
 * @param {Object} data
 * @param {Object} [data.initialState] - optional parameter to  set up initial state
 * @param {Function} data.promise - a promise that performs a request
 * @param {Function} [data.onSuccess] - callback on success fulfilled request. Must return new state
 * @param {Function} [data.onError] - callback on request fails. Must return new state
 * @param {Boolean} replace - replace existing reducer in cache
 */
export function applyRequestReducers (storeKey, data, replace = false) {
  const reducers = [];
  const commonInitialState = {
    data: {},
    error: null
  };
  Object.entries(data).forEach(([reducerName, options]) => {
    let {initialState, ...handlers} = options;
    initialState = Object.assign({}, commonInitialState, initialState);
    const cacheKey = `${storeKey}.${reducerName}`;
    cache[cacheKey] = {...createReducer({storeKey, reducerName, initialState, handlers})};
    reducers.push(cache[cacheKey].reducer);
  });
  return applyReducer(storeKey, localCompose(...reducers), replace);
}


export function createRequestReducer (store) {
  appStore = store;
}

export function requestReducer (key) {
  return {
    submit () {
      if (!cache[key]) {
        throw new Error (`There is no request reducer with key ${key} found`) ;
      }
      return appStore.dispatch(cache[key].submit(...arguments));
    }
  }
}
