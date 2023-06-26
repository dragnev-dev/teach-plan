import {ActionTypes} from './actionTypes';
import {Syllabus} from '../../models/syllabus';

export const addSyllabuses = (syllabuses: Syllabus[]) => ({
  type: ActionTypes.ADD_SYLLABUSES,
  payload: {syllabuses},
});
