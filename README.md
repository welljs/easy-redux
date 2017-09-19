# easy-redux
Helpers to facilitate the work with redux

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).



Основное предназначение - уход от размывания кода на actions, constants, types. Компонента становится независимой, инкапсулирует в себе все данные и методы которые нужны для работы.


Установка: 
```
    npm i easy-redux -S
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
import {createActions} from 'easy-redux';
import {STORE_KEY} from './index';
const ACTION_RESET = 'increment';
const ACTION_REMOTE_LIKES = 'remote_like';

const initialState = {
    isWaiting: false,
    isFailed: false,
    status: 'expired',
    likes: [],
};

export default const actions = createActions({
    initialState, 
    storeKey,
    actions: {
        [ACTION_REMOTE_LIKES]: {
            action: userId => ({promise: request => request('/api/likes').get({userId})}),
            handlers: {
                onWait: (state, action) => ({...state, isWaiting: true, isFailed: false}),
                onFail: (state, action) => ({...state, isWaiting: false, isFailed: true}),
                onSuccess: (state, action) => ({...state, isWaiting: false, likes: action.result, status:'updated'})
            }
        },
        [ACTION_RESET]: {
            action: () =>({}),
            handler: (state, action) => ({...state, ...Object.assign({}, initialState)})
        }
    }
});

export const loadLikes = actions[ACTION_REMOTE_LIKES];
export const reset = actions[ACTION_RESET];

```

```javascript
  
  //component.js
import {Component, PropTypes} from 'react';
import {STORE_KEY, dataShape} from './index';
import {connect} from 'react-redux';

import {loadLikes, reset} from './actions';

@connect(state => ({
    [STORE_KEY]: state[STORE_KEY]
}), {loadLikes, reset})
export default class MyComponent extends Component {
    static propTypes = {
        [STORE_KEY]: PropTypes.shape(dataShape),
        //actions
        loadLikes: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired
    };

    onUpdateClick = (e) => {
        this.props.loadLikes();
    };

    onResetClick = (e) => {
        this.props.reset();
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
