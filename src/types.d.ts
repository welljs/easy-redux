type TDispatch = (action: string) => void;
type TGetState = () => object;

interface IStore {
  dispatch: TDispatch;
  getState: TGetState;
}

type TActionType = string;
interface IAction {
  type: TActionType
}

type TActionWithPayload<Payload> = IAction | Payload;
type TReducer<Payload extends object, State extends object> = (state: State, action: TActionWithPayload<Payload>) => State;

/**
 * middleware.ts
 */
// request helper, like superagent
type TRequestHelper = () => Promise<any>;

type TPromiseHelper = (requestHelper: TRequestHelper) => Promise<any>;

type TCustomActionPromise = Promise<any> | {
  promise: TPromiseHelper
};

type TAsyncAction<Payload> = IAction & {
  promise: TPromiseHelper | TCustomActionPromise,
  types?: TActionType[],
  result?: any,
  error?: any
}

type TActionAsFunction = (dispatch: TDispatch, getState: TGetState) => any;

type TMiddlewareNext<Payload extends object> = (action: TAsyncAction<Payload> | TActionWithPayload<Payload>) => void;

interface IAsyncActionHandlers {
  onWait: TReducer,
  onFail: TReducer,
  onSuccess: TReducer
}


interface IActionOptions<Payload> {
  action: () => object,
  async?: boolean,
  storeKey: string,
  handlers?: IAsyncActionHandlers
  handler: TReducer<Payload>,
  initialState: object
}

interface ICreateActionsOptions {
  actions: object,
  initialState: object,
  storeKey: string
}