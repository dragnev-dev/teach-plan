import {Action} from 'redux';
import {ActionTypes} from '../actions/actionTypes';
import {Todo} from '../../models/todo';

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

export default function todoReducer(
  state = initialState,
  action: Action & {payload?: any},
): TodoState {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      const newTodo = action.payload.todo;
      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    case ActionTypes.DELETE_TODO:
      const id = action.payload.id;
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== id),
      };
    case ActionTypes.TOGGLE_TODO:
      const toggledId = action.payload.id;
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === toggledId ? {...todo, completed: !todo.completed} : todo,
        ),
      };
    case ActionTypes.EDIT_TODO:
      const editedId = action.payload.id;
      const editedTitle = action.payload.title;
      const editedDescription = action.payload.description;
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === editedId
            ? {...todo, title: editedTitle, description: editedDescription}
            : todo,
        ),
      };
    default:
      return state;
  }
}
