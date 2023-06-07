import {NonSchooling} from './nonSchooling';
import {TeacherScheduleEntry} from './teacherScheduleEntry';

export interface SchoolDay {
  nonSchoolingDay?: NonSchooling;
  entries: TeacherScheduleEntry[];
}
