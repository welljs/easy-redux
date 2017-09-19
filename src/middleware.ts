'use strict';

export default function<ActionPayload>(requestHelper: TRequest): TStorePassCallback<ActionPayload> {
  return ({dispatch, getState}: IStore): TNextPassCallback<ActionPayload> => {
    return (next: TMiddlewareNext<ActionPayload>): TActionPassCallback<ActionPayload> => {
      return (action: TCustomAction<ActionPayload>) => {
        
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }
   
        let {promise, types, ...rest} = action;
  
        if (!promise) {
          return next(action);
        }
  
        const [REQUEST, SUCCESS, FAILURE] = types;
        let actionPromise = promise(requestHelper);
  
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
    }
  }
}
