import {createAction} from '../src';

const TEST_ACTION = 'TEST_ACTION';
const initialState = {a: 1, b: 2, c: 3};
const storeKey = 'testStoreKey';

describe('Testing createAction synchronous', () => {
  const action = createAction(TEST_ACTION, {
    storeKey,
    initialState,
    action: () => ({}),
    handler: () => {}
  });
});
