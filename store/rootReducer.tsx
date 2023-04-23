import {Action} from 'redux';
import {ActionTypes} from './actions/actionTypes';

const initialState = {counter: 0};

export default function rootReducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.INCREMENT_COUNTER:
      return {...state, counter: state.counter + 1};
    case ActionTypes.DECREMENT_COUNTER:
      return {...state, counter: state.counter - 1};
    default:
      return state;
  }
}
