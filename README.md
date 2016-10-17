# easy-redux
Helpers to facilitate the work with redux

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).



Основная возможность - уход от размывания кода на actions, constants, types. Компонента становится независимой, инкапсулирует в себе все данные и методы которые нужны для работы.


Установка: 
```
    npm i easy-redux
```


В данном случае структура компоненты внутри приложения принимет следующий вид:



```
    /components
        /MyComponent
            actions.js
            component.js
            index.js                        
```


```javascript
//index.js
import {PropTypes} from 'react';
const {bool, string, array} = PropTypes;
export const dataShape = {
    isWaiting: bool,
    isFailed: bool,
    status: string.isRequired,
    likes: array.isRequired,
};
export const STORE_KEY = 'likes';
export MyComponent from './component';
```



```javascript

//actions.js
import {STORE_KEY} from './index';
export const ACTION_RESET = 'increment';
export const ACTION_REMOTE_LIKES = 'remote_like';

const initialState = {
    isWaiting: false,
    isFailed: false,
    status: 'expired',
    likes: [],
};

export default {
    [ACTION_REMOTE_LIKES]: createAction(ACTION_REMOTE_LIKES, {
        async: true,
        storeKey: STORE_KEY,
        initialState,
        action: userId => ({promise: request => request('/api/likes').get({userId})}),
        handlers: {
            onWait: (state, action) => ({...state, isWaiting: true, isFailed: false}),
            onFail: (state, action) => ({...state, isWaiting: false, isFailed: true}),
            onSuccess: (state, action) => ({...state, isWaiting: false, likes: action.result, status:'updated'})
        }
    }),
    [ACTION_RESET]: createAction (ACTION_RESET, {
        initialState,
        storeKey: STORE_KEY,
        action: () =>({}),
        handler: (state, action) => ({...state, ...Object.assign({}, initialState)})
    })
};


```

```javascript
  
  //component.js
import {Component, PropTypes} from 'react';
import {STORE_KEY, dataShape} from './index';
import {connect} from 'react-redux';

import {ACTION_REMOTE_LIKES, ACTION_RESET} from './actions';

@connect(state => ({
    [STORE_KEY]: state[STORE_KEY]
}), {ACTION_REMOTE_LIKES, ACTION_RESET})
export default class MyComponent extends Component {
    static propTypes = {
        [STORE_KEY]: PropTypes.shape(dataShape),
        //actions
        [ACTION_REMOTE_LIKES]: PropTypes.func.isRequired,
        [ACTION_RESET]: PropTypes.func.isRequired
    };

    onUpdateClick = (e) => {
        this.props[ACTION_REMOTE_LIKES]();
    };

    onResetClick = (e) => {
        this.props[ACTION_RESET]();
    };

    render () {
        const {[STORE_KEY]: {status, isWaiting}} = this.props;
        return (
            <div>
                <p>{status}</p>
                <button onClick={this.onUpdateClick} className={isWaiting ? 'waiting' : ''}>Update</button>
                <button onClick={this.onResetClick}>Reset</button>
            </div>
        );
    }
}

  
```

Соответственно при импорте компоненты в глобальном сторе появится поле `likes` (`STORE_KEY`), подключится `reducer` и `actions`
