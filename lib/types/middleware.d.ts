import { TActionWithPayload, IAction, TActionType } from './actionCreator';
export declare type TRequestHelper = (...args: any[]) => Promise<any>;
export declare type TPromiseHelper = (requestHelper: TRequestHelper) => Promise<any>;
export declare type TCustomActionPromise = Promise<any> | {
    promise: TPromiseHelper;
};
export declare type TAsyncAction = IAction & {
    promise?: TPromiseHelper | TCustomActionPromise;
    types?: TActionType[];
    result?: any;
    error?: any;
};
declare type TDispatch = (action: string) => void;
declare type TActionAsFunction = (dispatch: TDispatch, getState: TGetState) => any;
interface IStore {
    dispatch: TDispatch;
    getState: TGetState;
}
declare type TMiddlewareNext<Payload extends object> = (action: TAsyncAction | TActionWithPayload<Payload>) => void;
declare type TGetState = () => object;
export declare function middleware<Payload extends object>(requestHelper: TRequestHelper): (store: IStore) => (next: TMiddlewareNext<Payload>) => (action: TAsyncAction | TActionAsFunction) => void | Promise<any> | TPromiseHelper | {
    promise: TPromiseHelper;
} | TAsyncAction | TActionAsFunction;
export {};
