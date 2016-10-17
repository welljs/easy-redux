'use strict';
import {isFunction} from './index';
export default function(request){
    return ({dispatch, getState}) => next => action => {
        if(isFunction(action)){
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
            if (!isFunction(promise)) {
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
