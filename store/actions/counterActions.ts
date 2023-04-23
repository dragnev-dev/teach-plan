import {ActionTypes} from './actionTypes';

export const incrementCounter = () => ({
  type: ActionTypes.INCREMENT_COUNTER,
});

export const decrementCounter = () => ({
  type: ActionTypes.DECREMENT_COUNTER,
});
