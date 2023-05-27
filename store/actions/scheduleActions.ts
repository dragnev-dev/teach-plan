import {ActionTypes} from './actionTypes';
import {
  AddScheduleAction,
  AddSchedulePayload,
} from './actionCreators';

export const addSchedule = (
  payload: AddSchedulePayload,
): AddScheduleAction => ({
  type: ActionTypes.ADD_SCHEDULE,
  payload,
});
//
// export const updateTeacherSchedule = (
//   syllabuses: Syllabus[],
// ): UpdateTeacherScheduleAction => ({
//   type: ActionTypes.UPDATE_TEACHER_SCHEDULE,
//   payload: syllabuses,
// });
