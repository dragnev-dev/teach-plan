import {ActionTypes} from './actionTypes';
import {Syllabus} from '../../models/syllabus';

export const addSyllabus = (syllabus: Syllabus) => ({
  type: ActionTypes.ADD_SYLLABUS,
  payload: {syllabus},
});
