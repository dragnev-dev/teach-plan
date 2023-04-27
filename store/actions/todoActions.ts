import {ActionTypes} from './actionTypes';
import {Todo} from '../../models/todo';

export const addTodo = (todo: Todo) => ({
  type: ActionTypes.ADD_TODO,
  payload: {todo},
});

export const deleteTodo = (id: string) => ({
  type: ActionTypes.DELETE_TODO,
  payload: {id},
});

export const toggleTodo = (id: string) => ({
  type: ActionTypes.TOGGLE_TODO,
  payload: {id},
});

export const editTodo = (id: string, title: string, description: string) => ({
  type: ActionTypes.EDIT_TODO,
  payload: {id, title, description},
});
