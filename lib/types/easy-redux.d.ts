import { Reducer, ReducersMapObject } from 'redux';
export declare function applyReducer(key: string, fn: any, replace?: boolean): void;
export declare function combine<S>(reducers: ReducersMapObject): Reducer<S>;
export declare function localCompose(...reducers: any[]): (state: any, action: any) => any;
export declare function mergeReducer(key: string, fn: any): void;
