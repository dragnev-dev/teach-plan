import {SyllabusEntry} from './syllabus';

export interface TeacherScheduleEntry {
  class: number;
  subclass: string;
  subject: string;
  schoolHour: number;
  syllabusEntry: SyllabusEntry;
}
