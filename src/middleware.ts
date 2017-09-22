export default function<ActionPayload extends object>(requestHelper: TRequestHelper) {
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
    }
  }
}
