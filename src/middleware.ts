import {TActionWithPayload, IAction, TActionType} from './actionCreator';

// request helper, like superagent
type TRequestHelper = () => Promise<any>;

type TPromiseHelper = (requestHelper: TRequestHelper) => Promise<any>;

type TCustomActionPromise = Promise<any> | {
  promise: TPromiseHelper;
};

type TAsyncAction<Payload> = IAction & {
  promise: TPromiseHelper | TCustomActionPromise;
  types?: TActionType[];
  result?: any;
  error?: any;
};

type TDispatch = (action: string) => void;

type TActionAsFunction = (dispatch: TDispatch, getState: TGetState) => any;

interface IStore {
  dispatch: TDispatch;
  getState: TGetState;
}

type TMiddlewareNext<Payload extends object> = (action: TAsyncAction<Payload> | TActionWithPayload<Payload>) => void;

type TGetState = () => object;

export function middleware<ActionPayload extends object>(requestHelper: TRequestHelper) {
  return ({dispatch, getState}: IStore) => {
    return (next: TMiddlewareNext<ActionPayload>) => {
      return (action: TAsyncAction<ActionPayload> | TActionAsFunction) => {

        if (typeof action === 'function') {
          return action(dispatch, getState);
        }

        let {promise, types, ...rest} = action;

        if (!promise) {
          return next(action);
        }

        const [REQUEST, SUCCESS, FAILURE] = types as TActionType[];
        let actionPromise;

        if (typeof promise === 'function') {
          actionPromise = promise(requestHelper);
        }

        if (!(actionPromise instanceof Promise)) {
          const {promise, ...actionRest} = actionPromise;
          if (typeof promise !== 'function') {
            throw new Error('Bad promise');
          }
          rest = Object.assign(rest, actionRest);
          actionPromise = promise(requestHelper);
        }

        next({...rest, type: REQUEST});
        actionPromise
          .then(result => next({...rest, result, type: SUCCESS}))
          .catch(error => next({...rest, error, type: FAILURE}));
        return actionPromise;
      };
    };
  };
}
