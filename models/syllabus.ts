export interface Syllabus {
  id: number;
  subject: string;
  class: number;
  syllabusEntries: SyllabusEntry[];
  secondTermStartEntry?: number;
  year: number;
  version: number;
}

export interface SyllabusEntry {
  topicName: string;
  lessonUnit: string;
  expectedResults: string;
  methodsAndWorkForms: string;
  number: number;
  week: number;
}
