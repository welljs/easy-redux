type IAsyncActionTypes = string[];

type TDispatch = (action: string) => void;
type TGetState = () => object;

// request helper, like superagent
type TRequest = () => any;
type TReducer = (state: object, action: object) => object;

interface IStore {
  dispatch: TDispatch;
  getState: TGetState;
}

interface IActionDefaults {
  promise: TActionPromise;
}

type TActionPromise<ExtraData> = (request: TRequest) => Promise<any> | IActionDefaults & ExtraData;

interface IAsyncActionDefaults {
  promise: TActionPromise;
  types: IAsyncActionTypes;
}

type TActionAsFunction = (dispatch: TDispatch, getState: TGetState) => void;
type TActionAsObject<ExtraData> = IAsyncActionDefaults & ExtraData;
type TAction<ExtraData> = TActionAsFunction | TActionAsObject<ExtraData>;

interface IActionDefaults {
  type: string
}

interface IAsyncActionHandlers {
  onWait: TReducer,
  onFail: TReducer,
  onSuccess: TReducer
}

interface IActionOptions {
  action: IActionDefaults,
  async?: boolean,
  storeKey: string,
  handlers?: IAsyncActionHandlers
  handler: TReducer,
  initialState: object
}