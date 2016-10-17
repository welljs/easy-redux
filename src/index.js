export const isFunction = thing => typeof thing === 'function';

export { default as middleware } from './middleware';

export {
    applyReducer,
    localCompose,
    combine,
    mergeReducer
} from './easy-redux';

export {createAction} from './actionCreator';