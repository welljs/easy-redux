export const isFunction = (thing: any): boolean => typeof thing === 'function';

export {default as middleware} from './middleware';

export {
  applyReducer,
  localCompose,
  combine,
  mergeReducer
} from './easy-redux';

export {createAction, createActions} from './actionCreator';

export {
  applyRequestReducers,
  createRequestReducer,
  requestReducer
} from './requestReducer';
