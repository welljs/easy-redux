import { TAsyncAction } from './middleware';
export declare type TActionWithPayload<Payload> = IAction & Payload;
export declare type TReducer<Payload extends object, State extends object> = (state: State, action: TActionWithPayload<Payload>) => State;
export interface IAsyncActionHandlers<Payload extends object, State extends object> {
    onWait: TReducer<Payload, State>;
    onFail: TReducer<Payload, State>;
    onSuccess: TReducer<Payload, State>;
}
export interface IActionOptions<Payload extends object, State extends object> {
    action: () => object;
    async?: boolean;
    storeKey: string;
    handlers?: IAsyncActionHandlers<Payload, State>;
    handler: TReducer<Payload, State>;
    initialState: State;
}
export declare type TActionType = string;
export interface IAction {
    type: TActionType;
    result?: any;
    error?: any;
}
interface ICreateActionsOptions<State extends object> {
    actions: object;
    initialState: State;
    storeKey: string;
}
export declare function createAction<Payload extends object, State extends object>(name: string, options: IActionOptions<Payload, State>): () => void | IAction | TAsyncAction;
export declare function createActions<State extends object>(options: ICreateActionsOptions<State>): {};
export {};
