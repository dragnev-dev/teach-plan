import {ActionTypes} from '../actions/actionTypes';
import {Syllabus, SyllabusEntry} from '../../models/syllabus';
import {Action} from 'redux';

interface SyllabusState {
  syllabuses: Syllabus[];
}
const initialState: SyllabusState = {
  syllabuses: [],
};

export function syllabusReducer(
  state = initialState,
  action: Action & {payload?: any},
): SyllabusState {
  switch (action.type) {
    case ActionTypes.ADD_SYLLABUSES:
      return {
        ...state,
        syllabuses: [...state.syllabuses].concat(action.payload.syllabuses),
      };
    default:
      return state;
  }
}

// selectors
export const getSyllabusEntry = (
  state: SyllabusState,
  subject: string,
  classNum: number,
  entryNum: number,
): SyllabusEntry | undefined => {
  const syllabus = state.syllabuses.find(
    s => s.subject === subject && s.class === classNum,
  );
  return syllabus
    ? syllabus.syllabusEntries.find(e => e.number === entryNum)
    : undefined;
};

export const getSyllabusEntries = (
  state: SyllabusState,
  subject: string,
  classNum: number,
): SyllabusEntry[] => {
  const syllabus = state.syllabuses.find(
    s => s.subject === subject && s.class === classNum,
  );
  return syllabus ? syllabus.syllabusEntries : [];
};

export const selectSyllabusById = (
  state: SyllabusState,
  syllabusId: number,
) => {
  return state.syllabuses.find(s => s.id === syllabusId);
};
