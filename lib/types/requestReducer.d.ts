import { TReducer } from './actionCreator';
export declare type TBasicState = object & {
    isWaiting: boolean;
    isFailed: boolean;
};
export interface IReducerHandlers<Payload extends object, State extends TBasicState> {
    onWaiting: TReducer<Payload, State>;
    onFail: TReducer<Payload, State>;
    onSuccess: TReducer<Payload, State>;
    promise: (request: any) => (...args: any[]) => any;
}
export interface ICreateReducerArgs<Payload extends object, State extends TBasicState> {
    storeKey: string;
    reducerName: string;
    initialState: State;
    handlers: IReducerHandlers<Payload, State>;
}
export interface IRequestReducersData<Payload extends object, State extends TBasicState> {
    [key: string]: IReducerHandlers<Payload, State> & {
        initialState: State;
    };
}
export declare function applyRequestReducers<Payload extends object, State extends TBasicState>(storeKey: any, data: IRequestReducersData<Payload, State>, replace?: boolean): void;
export declare function createRequestReducer(store: any): void;
export declare function requestReducer(key: any): {
    submit(): any;
};
