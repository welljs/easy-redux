import {applyReducer, localCompose} from './easy-redux';
import {TActionWithPayload, TReducer} from './actionCreator';
import {Store} from 'redux';

let appStore: Store<object> | null = null;
const cache = {};

export type TBasicState = object & {
  isWaiting: boolean;
  isFailed: boolean;
}

export interface IReducerHandlers<Payload extends object, State extends TBasicState> {
  onWaiting: TReducer<Payload, State>;
  onFail: TReducer<Payload, State>;
  onSuccess: TReducer<Payload, State>;
  promise: (request) => (...args: any[]) => any;
}

export interface ICreateReducerArgs<Payload extends object, State extends TBasicState> {
  storeKey: string;
  reducerName: string;
  initialState: State;
  handlers: IReducerHandlers<Payload, State>;
}

export interface IRequestReducersData<Payload extends object, State extends TBasicState> {
  [key: string]: IReducerHandlers<Payload, State> & {initialState: State}
}

function createReducer<Payload extends object, State extends TBasicState>({storeKey, reducerName, initialState, handlers}: ICreateReducerArgs<Payload, State>) {
  const WAITING_STATE = `${storeKey}@${reducerName}.waiting`;
  const SUCCESS_STATE = `${storeKey}@${reducerName}.success`;
  const FAIL_STATE = `${storeKey}@${reducerName}.fail`;
  const {onWaiting, onFail, onSuccess} = handlers;
  return {
    reducer (state = Object.assign({isFailed: false, isWaiting: false}, initialState), action: TActionWithPayload<Payload>) {

      switch (action.type) {
        case WAITING_STATE: {
          if (typeof onWaiting === 'function') {
            return Object.assign({}, onWaiting(state, action), {isWaiting: true, isFailed: false});
          }
          else {
            return Object.assign({}, state, {isWaiting: true, isFailed: false});
          }
        }
        case SUCCESS_STATE: {
          if (typeof onSuccess === 'function') {
            return Object.assign({isWaiting: false, isFailed: false}, onSuccess(state, action));
          }
          else {
            return Object.assign({}, state, {isWaiting: false, isFailed: false, data: action.result});
          }
        }
        case FAIL_STATE: {
          if (typeof onFail === 'function') {
            return Object.assign({isWaiting: false, isFailed: true}, onFail(state, action));
          }
          else {
            return Object.assign({}, state, {isWaiting: false, isFailed: true, error: action.error});
          }
        }
        default: return state;
      }
    },
    submit () {
      let {promise} = handlers;
      const args: any = arguments;
      return {
        types: [ WAITING_STATE, SUCCESS_STATE, FAIL_STATE ],
        promise: request => promise(request)(...args)
      };
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
export function applyRequestReducers<Payload extends object, State extends TBasicState>(storeKey, data: IRequestReducersData<Payload, State>, replace = false) {
  const reducers: any[] = [];
  const commonInitialState = {
    error: null
  };
  Object.entries(data).forEach(([reducerName, options]) => {
    let {initialState, ...handlers} = options;
    initialState = Object.assign(initialState, commonInitialState);
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
      return appStore ? appStore.dispatch(cache[key].submit(...arguments as any)) : undefined;
    }
  };
}
