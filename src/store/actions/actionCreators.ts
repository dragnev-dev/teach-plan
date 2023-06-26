import {ActionTypes} from './actionTypes';
import {Schedule} from '../../models/schedule';
import {Syllabus} from '../../models/syllabus';

export interface AddSchedulePayload {
  schedule: Schedule;
  teacherName: string;
  syllabuses: Syllabus[];
}

export interface AddScheduleAction {
  type: ActionTypes.ADD_SCHEDULE;
  payload: AddSchedulePayload;
}

// export interface UpdateTeacherScheduleAction {
//   type: ActionTypes.UPDATE_TEACHER_SCHEDULE;
//   payload: Syllabus[];
// }
