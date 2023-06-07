import {SyllabusEntry} from './syllabus';
import {NonSchooling} from './nonSchooling';

export interface TeacherScheduleEntry {
  class: number;
  subclass: string;
  subject: string;
  schoolHour: number;
  isNonSchoolHour?: NonSchooling;
  syllabusEntry?: SyllabusEntry;
}
