'use strict';
export default function(request){
    return ({dispatch, getState}) => next => action => {
        if(typeof action === 'function'){
            return action(dispatch, getState);
        }
        let {promise, types, ...rest} = action;
        if(!promise){
            return next(action);
        }

        const [ REQUEST, SUCCESS, FAILURE ] = types;
        let actionPromise = promise(request);

        if (!(actionPromise instanceof Promise)) {
            const {promise, ...actionRest} = actionPromise;
            if (typeof promise !== 'function') {
                throw new Error('Bad promise');
            }
            rest = Object.assign(rest, actionRest);
            actionPromise = promise(request);
        }

        next({...rest, type: REQUEST});
        actionPromise
            .then(result => next({...rest, result, type: SUCCESS}))
            .catch(error => next({...rest, error, type: FAILURE}));
        return actionPromise;
    }
}
