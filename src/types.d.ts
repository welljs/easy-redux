type TDispatch = (action: string) => void;
type TGetState = () => object;

interface IStore {
  dispatch: TDispatch;
  getState: TGetState;
}

type TActionType = string;

interface IActionDefaults {
  type: TActionType
  result?: any,
  error?: any
}
type TAction<Payload> = IActionDefaults & Payload;
type TReducer<Payload> = (state: object, action: TAction<Payload>) => object;


/**
 * middleware.ts
 */
interface ICustomAction {
  promise: TPromiseHelper | TCustomActionPromise,
  types: TActionType[]
}
type TCustomActionAsFunction = (dispatch: TDispatch, getState: TGetState) => any;
type TCustomAction<Payload> = (TAction<Payload> & ICustomAction) | TCustomActionAsFunction;
type TMiddlewareNext<Payload> = (action: TCustomAction<Payload> | TAction<Payload>) => void;


// request helper, like superagent
type TRequest = () => Promise<any>;

type TPromiseHelper = (requestHelper: TRequest) => Promise<any>;

type TCustomActionPromise = Promise<any> | {
  promise: TPromiseHelper
};

type TActionPassCallback<Payload> = (action: TAction<Payload> | TCustomAction<Payload>) => Promise<any>;
type TNextPassCallback<Payload> = (next: TMiddlewareNext<Payload>) => TActionPassCallback<Payload>;
type TStorePassCallback<Payload> = (store: IStore) => TNextPassCallback<Payload>;
type TAsyncMiddleware<Payload> = (requestHelper: TRequest) => TStorePassCallback<Payload>;

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