type IAsyncActionTypes = string[];

type TDispatch = (action: string) => void;
type TGetState = () => object;

// request helper, like superagent
type TRequest = () => any;

interface IStore {
  dispatch: TDispatch;
  getState: TGetState;
}

interface IActionDefaults {
  promise: TActionPromise;
}

type TActionPromise<ExtraData> = (request: TRequest) => Promise<any> | IActionDefaults & ExtraData;

interface IActionDefaults {
  promise: TActionPromise;
  types: IAsyncActionTypes;
}

type TActionAsFunction = (dispatch: TDispatch, getState: TGetState) => void;
type TActionAsObject<ExtraData> = IActionDefaults & ExtraData;
type TAction<ExtraData> = TActionAsFunction | TActionAsObject<ExtraData>;
