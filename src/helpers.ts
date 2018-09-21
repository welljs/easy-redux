import {applyReducer, localCompose} from './easy-redux';

// TODO: cache лежал раньше в easy-redux.ts
export function mergeReducer(key: string, fn): void {
  if (!cache[key]) {
    throw new Error(`Reducer with name ${key} not found`);
  }
  applyReducer(key, localCompose(cache[key], fn), true);
}

export const isFunction = (thing: any): boolean => typeof thing === 'function';
