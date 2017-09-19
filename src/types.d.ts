type TDispatch = (action: string) => void;
type TGetState = () => object;

interface IStore {
  dispatch: TDispatch;
  getState: TGetState;
}

interface IActionDefaults {
  type: string
}

type TAction<Payload> = IActionDefaults & Payload;
type TReducer<Payload> = (state: object, action: TAction<Payload>) => object;

type TMiddlewareNext<Payload> = (action: TCustomAction<Payload>) => void;
// request helper, like superagent
type TRequest = () => Promise<any>;

interface ICustomAction {
  promise: TRequest,
  types: any[]
}
type TCustomActionAsFunction = (dispatch: TDispatch, getState: TGetState) => any;
type TCustomAction<Payload> = (ICustomAction & Payload) | TCustomActionAsFunction;

type TActionPassCallback<Payload> = (action: TAction<Payload> | TCustomAction<Payload>) => Promise<any>;
type TNextPassCallback<Payload> = (next: TMiddlewareNext<Payload>) => TActionPassCallback<Payload>;
type TStorePassCallback<Payload> = (store: IStore) => TNextPassCallback<Payload>;
type TAsyncMiddleware<Payload> = (requestHelper: TRequest) => TStorePassCallback<Payload>;

type IAsyncActionTypes = string[];

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