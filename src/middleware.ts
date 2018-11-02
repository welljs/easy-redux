import {TActionWithPayload, IAction, TActionType} from './actionCreator';

// request helper, like superagent
export type TRequestHelper = (...args: any[]) => Promise<any>;

export type TPromiseHelper = (requestHelper: TRequestHelper) => Promise<any>;

export type TCustomActionPromise = Promise<any> | {
  promise: TPromiseHelper;
};

export type TAsyncAction = IAction & {
  promise?: TPromiseHelper | TCustomActionPromise;
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

type TMiddlewareNext<Payload extends object> = (action: TAsyncAction | TActionWithPayload<Payload>) => void;

type TGetState = () => object;

type TMiddlewareReturns<Payload> = TPromiseHelper | TCustomActionPromise | TAsyncAction | TActionAsFunction;

export function middleware<Payload extends object>(requestHelper: TRequestHelper) {
  return (store: IStore) => {
    return (next: TMiddlewareNext<Payload>) => {
      return (action: TAsyncAction | TActionAsFunction): TMiddlewareReturns<Payload> | void => {
        const {dispatch, getState} = store;
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
