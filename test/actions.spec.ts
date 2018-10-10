import {createAction, createActions} from '../src';

const TEST_ACTION = 'TEST_ACTION';
const TEST_ACTION_TWO = 'TEST_ACTION_TWO';
const initialState = {a: 1, b: 2, c: 3};
const storeKey = 'testStoreKey';

describe('testing actions', () => {
  describe('createAction', () => {
    const action = createAction(TEST_ACTION, {
      storeKey,
      initialState,
      action: () => ({}),
      handler: (state, action) => state
    });
    it('should create action with correct type', () => {
      const result = action();
      expect(result && result.type).toEqual(TEST_ACTION);
    });
  });
  describe('createActions', () => {
    const actionsCount = 2;
    const actions = createActions({
      storeKey,
      initialState,
      actions: {
        [TEST_ACTION]: {
          action: () => ({}),
          handler: (state, action) => state
        },
        [TEST_ACTION_TWO]: {
          action: () => ({}),
          handler: (state, action) => state
        }
      }
    });
    it('should create correct count actions', () => {
     expect(Object.keys(actions).length).toEqual(actionsCount);
    });
    it('should have correct type', () => {
      const result = actions[TEST_ACTION_TWO]();
      expect(result && result.type).toEqual(TEST_ACTION_TWO);
    });
  });
});
